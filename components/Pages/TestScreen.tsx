import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, Text, ToastAndroid, View } from 'react-native';
import { Avatar, Button, RadioButton } from 'react-native-paper';
import { Styles } from '../../Styles/Styles';
import ConfirmationModal from '../Utils/ConfirmationModel';
import { ConnectionStatusContext } from '../Utils/ConnectionStatusContext';

const TestScreen = () => {
  const navigation = useNavigation();
  const {setSocketConnected} = useContext(ConnectionStatusContext);
  const [socket, setSocket] = useState<any>({});
  const [RadioButtonValue, setRadioButonValue] = useState({
    gps: '',
    lights: '',
  });
  const [response, setResponse] = useState<any>({});
  const [loader, setLoader] = useState<any>({});
  const [TestState, setTestState] = useState<any>({
    TestStart: false,
    MajorTest: '',
    Test1: '',
    Test2: '',
    Test3: '',
    FinalResultSubmitBtn: false,
  });
  const [isModalVisible, setIsModalVisible] = useState({
    model1: false,
    model2: false,
  });
  const [modalQuestion, setModalQuestion] = useState('');
  const [status, setStatus] = useState<any>({
    B: 0,
    C: 0,
    D: 0,
    N: 0,
    O: 0,
    P: 0,
  });
  const [modalHandlers, setModalHandlers] = useState({
    handleYes: () => {},
    handleNo: () => {},
    handleAbandon: () => {},
    Continue: () => {},
  });

  // const [abandoned, setAbandoned] = useState(false);

  // const [errorMessage, setErrorMessage] = useState("");

  const [autoMatedTestRes, setAutoMatedTestRes] = useState<any>({});
  const [config, setConfig] = useState({motorValue: '', engineValue: ''});

  // toaster function
  const Toaster = (msg: any) => ToastAndroid.show(msg, ToastAndroid.SHORT);

  //fireman pump test
  const MotorTest = async () => {
    let test1Result: any = {};

    setTestState((prev: any) => {
      return {...prev, MajorTest: 'Test1'};
    });

    sendMsgAndHoldForResponse(`E,${config.motorValue}`);
    await new Promise(resolve => setTimeout(() => resolve(true), 2000));
    sendMsgAndHoldForResponse(`Q,${config.engineValue}`);
    await new Promise(resolve => setTimeout(() => resolve(true), 2000));
    const message: any = 'A';
    const resA: any = await sendMsgAndHoldForResponse(message);

    let splitRes = resA.split(',')[1];
    Toaster(`Rx A ${splitRes[1]}`);

    if (splitRes.charCodeAt(0) !== '9'.charCodeAt(0)) {
      let commands = ['B', 'C', 'D'];

      for (const command of commands) {
        let response: any = '';
        let res: any = '';
        do {
          response = await sendMsgAndHoldForResponse(command);
          const split = response.split(',');
          Toaster(`Rx: ${response}`);
          res = split[1];
          if (command === 'B' && res === '0') {
            setIsModalVisible({...isModalVisible, model1: true});
            setModalQuestion('Did you start the switch?');
            const userResponse = await waitForUserAction();
            if (userResponse === 'yes') {
              // setErrorMessage(`There is a fault in wiring`);
              setIsModalVisible({...isModalVisible, model2: true});

              setModalQuestion('Do you want to:');
              const stop = await waitForUserAction2();
              if (stop === 'yes') {
                // setAbandoned(true);
                setTestState((prev: any) => {
                  return {...prev, MajorTest: ''};
                });
                throw new Error();
              } else if (stop === 'no') {
                break;
              }
            }
          } else if (command === 'B' && res === '9') {
            ToastAndroid.show(
              'There is issue in feedback system',
              ToastAndroid.SHORT,
            );
            setStatus((prev: any) => ({...prev, B: 3}));
          }
        } while (command === 'B' && res === '0');

        if (res !== '0') {
          if (command === 'C') {
            test1Result[command] = `${res} Amp`;
          } else {
            test1Result[command] = res;
          }
          setResponse((prev: any) => ({...prev, [command]: res}));
        } else {
          if (command === 'D') test1Result[command] = '0';
          break;
        }
      }
    } else {
      ToastAndroid.show(
        'Fireman pump is already started, turn it off and run the test again',
        ToastAndroid.SHORT,
      );
      return {
        B: '0',
        C: '0',
        D: '0',
      };
    }
    return test1Result;
  };

  //light test
  const lightTest = async () => {
    let test2Result: any = {};

    setTestState((prev: any) => {
      return {...prev, MajorTest: 'Test2'};
    });
    const resM: any = await sendMsgAndHoldForResponse('M');
    let splitRes = resM.split(',')[1];
    Toaster(`Rx M ${splitRes[1]}`);
    if (splitRes.charCodeAt(0) !== '9'.charCodeAt(0)) {
      let commands = ['N', 'O', 'P'];

      for (const command of commands) {
        let response: any = '';
        let res: any = '';
        do {
          // setLoader({ [command]: true });
          response = await sendMsgAndHoldForResponse(command);
          const split = response.split(',');
          Toaster(`Rx: ${response}`);
          res = split[1];
          if (command === 'N' && res == '0') {
            setIsModalVisible({...isModalVisible, model1: true});
            setModalQuestion('Did you start the switch?');
            const userResponse = await waitForUserAction();
            if (userResponse === 'yes') {
              // setErrorMessage(`There is a fault in wiring for command`);
              setIsModalVisible({...isModalVisible, model2: true});

              setModalQuestion('Do you want to:');
              const stop = await waitForUserAction2();
              if (stop === 'yes') {
                // setAbandoned(true);
                throw new Error();
              } else if (stop === 'no') {
                break;
              }
            }
          } else if (command === 'N' && res === '9') {
            ToastAndroid.show(
              'There is issue in feedback system',
              ToastAndroid.SHORT,
            );
            setStatus((prev: any) => ({...prev, N: 3}));
          }
        } while (command === 'N' && res === '0');

        if (res !== '0') {
          if (command === 'P') {
            test2Result[command] = `${res} out 7 lights are On`;
          } else if (command === 'O') {
            test2Result[command] = `${res} Amp`;
          } else {
            test2Result[command] = res;
          }
          setResponse((prev: any) => ({...prev, [command]: res}));
        } else {
          // setErrorMessage(`There is a fault in wiring for command ${command}`);
          if (command === 'P') test2Result[command] = '0';
          break; // Exit the loop or handle as needed
        }
      }
    } else {
      ToastAndroid.show(
        'lights are already started, turn it off and run the test again',
        ToastAndroid.SHORT,
      );
      return {
        N: '0',
        O: '0',
        P: '0',
      };
    }
    return test2Result;
  };

  // turned on switch or not
  const waitForUserAction = () => {
    return new Promise(resolve => {
      const handleYes = () => {
        setIsModalVisible({...isModalVisible, model1: false});

        resolve('yes');
      };

      const handleNo = () => {
        setIsModalVisible({...isModalVisible, model1: false});

        resolve('no');
      };
      setModalHandlers(prev => {
        return {...prev, handleYes, handleNo};
      });
    });
  };

  //abundant test or continue
  const waitForUserAction2 = () => {
    return new Promise(resolve => {
      const handleAbandon = () => {
        setIsModalVisible({...isModalVisible, model2: false});
        resolve('yes');
      };

      const Continue = () => {
        setIsModalVisible({...isModalVisible, model2: false});
        resolve('no');
      };

      setModalHandlers(prev => {
        return {...prev, handleAbandon, Continue};
      });
    });
  };

  const sendMsgAndHoldForResponse = (command: string) => {
    return new Promise(async resolve => {
      setLoader((prev: any) => ({...prev, [command]: true}));
      // Send command
      setStatus((prev: any) => {
        return {...prev, [command]: 1};
      });
      Toaster(`Tx: ${command}`);
      // await new Promise(resolve => setTimeout(resolve, 1000));

      socket.send(command);

      const onMessage = (e: any) => {
        socket.removeEventListener('message', onMessage); // Remove listener after receiving response
        setLoader((prev: any) => ({...prev, [command]: false}));

        setStatus((prev: any) => {
          return {...prev, [command]: e.data.split(',')[1] == '0' ? 3 : 2};
        });

        resolve(e.data);
      };
      // Set up listener for WebSocket response
      socket.addEventListener('message', onMessage);
      // Optional: Implement rejection logic or timeout if needed
    });
  };

  //main function
  const mainFunction = async () => {
    try {
      ToastAndroid.show('Test Started', ToastAndroid.SHORT);
      setTestState((prev: any) => {
        return {...prev, TestStart: true};
      });
      const test1Results = await MotorTest();
      setTestState((prev: any) => {
        return {...prev, Test1: test1Results.D};
      });
      setTestState((prev: any) => {
        return {...prev, MajorTest: ''};
      });
      await new Promise(resolve => setTimeout(() => resolve(true), 2000));
      const test2Results = await lightTest();
      setTestState((prev: any) => {
        return {...prev, Test2: test2Results.P};
      });
      setTestState((prev: any) => {
        return {...prev, MajorTest: ''};
      });
      const combinedResults = {
        Test1: test1Results,
        Test2: test2Results,
      };
      // await saveTestLogs({Test1: test1Results});
      await saveTestLogs(combinedResults);
      ToastAndroid.show('Test Completed successfully', ToastAndroid.SHORT);
      // setAutoMatedTestRes(combinedResults);
    } catch (e) {
      ToastAndroid.show('test failed', ToastAndroid.SHORT);
    }
  };

  const handleFinalTest = async (e: any) => {
    ToastAndroid.show('Test Completed', ToastAndroid.SHORT);
    navigation.navigate("Home" as never);
    // e.preventDefault();
    // const Test3Res = {
    //   T1: RadioButtonValue.gps,
    //   T2: RadioButtonValue.lights,
    // };

    // let localRes = {
    //   ...TestState,
    // };

    // if (RadioButtonValue.gps === "1" && RadioButtonValue.lights === "1") {
    //   setTestState({ ...TestState, Test3: "1" });
    //   localRes = { ...localRes, Test3: "1" };
    // } else {
    //   setTestState({ ...TestState, Test3: "0" });
    //   localRes = { ...localRes, Test3: "0" };
    // }
    // setTestState((prev: any) => {
    //   return { ...prev, TestStart: false };
    // });
    // // await saveTestLogs(
    // //   { ...autoMatedTestRes, Test3: { ...Test3Res } },
    // //   localRes
    // // );
    // ToastAndroid.show("Test Completed", ToastAndroid.SHORT);
    // ToastAndroid.show("Check Result In Log", ToastAndroid.SHORT);
    // setTestState((prev: any) => {
    //   return { ...prev, FinalResultSubmitBtn: true };
    // });
    // setTestState((prev: any) => {
    //   return { ...prev, MajorTest: "" };
    // });
  };

  const generateRandomId = () => {
    const number = Math.floor(Math.random() * 10000000); // Generates a number up to 9999999
    return String(number).padStart(7, '0'); // Pads with leading zeros if less than 7 digits
  };

  const formatDate = (date: any) => {
    const pad = (num: any) => (num < 10 ? `0${num}` : num);

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // getMonth() returns a zero-based index
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const calculateOverALLResult = (TestState: any) => {
    if (TestState.Test1.D === '1' && TestState.Test2.P !== '0') {
      return true;
    } else {
      return false;
    }
  };

  const saveTestLogs = async (combinedResults: any) => {
    const uniqueId = generateRandomId();
    const newLog = {
      Test: combinedResults,
      timestamp: formatDate(new Date()),
      overAllResult: calculateOverALLResult(combinedResults),
      id: uniqueId,
    };

    try {
      const existingLogsJson = await AsyncStorage.getItem('@test_logs');
      let existingLogs =
        existingLogsJson != null ? JSON.parse(existingLogsJson) : [];
      if (!Array.isArray(existingLogs)) {
        existingLogs = []; // Ensure existingLogs is always an array
      }
      existingLogs.push(newLog);
      const jsonValue = JSON.stringify(existingLogs);
      await AsyncStorage.setItem('@test_logs', jsonValue);
    } catch (e) {}
  };

  const getConfigLogs = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@config_logs');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {}
  };

  useEffect(() => {
    const socket = new WebSocket('ws://192.168.4.1:80/ws');
    // const socket = new WebSocket('ws://192.168.10.19:8080');
    socket.onopen = () => {
      ToastAndroid.show('Connection Successful', ToastAndroid.LONG);
      setSocketConnected(true);
    };
    socket.onerror = (e: any) => {
      ToastAndroid.show(
        `Connection Failed ${e.type} ${e.message}`,
        ToastAndroid.LONG,
      );

      setSocketConnected(false);
    };
    socket.onclose = (e: any) => {
      ToastAndroid.show('Connection Closed', ToastAndroid.SHORT);
      setSocketConnected(false);
    };
    setSocket(socket);
    return () => {
      socket.close();
      setSocketConnected(false);
      ToastAndroid.show('Connection Closed', ToastAndroid.SHORT);
    };
  }, []);

  useEffect(() => {
    const loadConfig = async () => {
      const loadedConfig = await getConfigLogs();
      setConfig(loadedConfig);
    };
    loadConfig();
  }, []);

  return (
    <ScrollView>
      <View>
        <Button
          style={Styles.button}
          uppercase={true}
          buttonColor="#2a2c93"
          disabled={TestState.TestStart ? true : false}
          mode="contained"
          onPress={mainFunction}>
          {TestState.TestStart ? 'Test Started' : 'Start Test'}
        </Button>
        {/* Test One :- motor test */}
        <View>
          <View style={Styles.header}>
            <View>
              <Text style={Styles.headerText}>Fireman Pump</Text>
            </View>
            <View>
              <Text>
                {TestState.MajorTest === 'Test1' ? (
                  <Avatar.Image
                    size={24}
                    source={require('../../assets/running.png')}
                  />
                ) : TestState.Test1 === '1' ? (
                  <Avatar.Image
                    size={24}
                    source={require('../../assets/done.png')}
                  />
                ) : TestState.Test1 === '0' ? (
                  <Avatar.Image
                    size={24}
                    source={require('../../assets/smallFailed.png')}
                  />
                ) : (
                  ''
                )}
              </Text>
            </View>
          </View>
          <View style={Styles.subSection}>
            <View style={Styles.subSectionContainer}>
              <View>
                <Text style={Styles.subSectionText}>1. Turn On Switch</Text>
              </View>
              <View>
                <Text
                  style={{
                    color: 'white',
                  }}>
                  {status['B'] === 1 ? (
                    <Avatar.Image
                      size={24}
                      source={require('../../assets/running.png')}
                    />
                  ) : status['B'] === 2 ? (
                    <Avatar.Image
                      size={24}
                      source={require('../../assets/smallDone.png')}
                    />
                  ) : (
                    status['B'] === 3 && (
                      <Avatar.Image
                        size={24}
                        source={require('../../assets/smallFailed.png')}
                      />
                    )
                  )}
                </Text>
              </View>
            </View>
            <View style={Styles.subSectionContainer}>
              <View>
                <Text style={Styles.subSectionText}>2. Measured Current</Text>
              </View>
              <View>
                <Text style={{color: '#a3a3a3'}}>
                  {loader['C'] ? (
                    <Avatar.Image
                      size={24}
                      source={require('../../assets/running.png')}
                    />
                  ) : (
                    response['C'] && `${response['C'].substring(0, 5)} Amp`
                  )}
                </Text>
              </View>
            </View>
            <View style={Styles.subSectionContainer}>
              <View>
                <Text style={Styles.subSectionText}>3. Final Status</Text>
              </View>
              <View>
                <Text>
                  {status['D'] === 1 ? (
                    <Avatar.Image
                      size={24}
                      source={require('../../assets/running.png')}
                    />
                  ) : status['D'] === 2 ? (
                    <Avatar.Image
                      size={24}
                      source={require('../../assets/smallDone.png')}
                    />
                  ) : (
                    status['D'] === 3 && (
                      <Avatar.Image
                        size={24}
                        source={require('../../assets/smallFailed.png')}
                      />
                    )
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* Test 2 :- engine test*/}
        <View>
          <View style={Styles.header}>
            <View>
              <Text style={Styles.headerText}>Navigation Lights</Text>
            </View>
            <View>
              <Text>
                {TestState.MajorTest === 'Test2' ? (
                  <Avatar.Image
                    size={24}
                    source={require('../../assets/running.png')}
                  />
                ) : TestState.Test2 !== '0' && TestState.Test2 !== '' ? (
                  <Avatar.Image
                    size={24}
                    source={require('../../assets/done.png')}
                  />
                ) : TestState.Test2 === '0' ? (
                  <Avatar.Image
                    size={24}
                    source={require('../../assets/smallFailed.png')}
                  />
                ) : (
                  ''
                )}
              </Text>
            </View>
          </View>
          <View style={Styles.subSection}>
            <View style={Styles.subSectionContainer}>
              <View>
                <Text style={Styles.subSectionText}>1. Turn On Switch</Text>
              </View>
              <View>
                <Text>
                  {status['N'] === 1 ? (
                    <Avatar.Image
                      size={24}
                      source={require('../../assets/running.png')}
                    />
                  ) : status['N'] === 2 ? (
                    <Avatar.Image
                      size={24}
                      source={require('../../assets/smallDone.png')}
                    />
                  ) : (
                    status['N'] === 3 && (
                      <Avatar.Image
                        size={24}
                        source={require('../../assets/smallFailed.png')}
                      />
                    )
                  )}
                </Text>
              </View>
            </View>
            <View style={Styles.subSectionContainer}>
              <View>
                <Text style={Styles.subSectionText}>2. Measured Current</Text>
              </View>
              <View>
                <Text style={{color: '#a3a3a3'}}>
                  {' '}
                  {loader['O'] ? (
                    <Avatar.Image
                      size={24}
                      source={require('../../assets/running.png')}
                    />
                  ) : (
                    response['O'] && `${response['O'].substring(0, 5)} Amp`
                  )}
                </Text>
              </View>
            </View>
            <View style={Styles.subSectionContainer}>
              <View>
                <Text style={Styles.subSectionText}>3. Final Status</Text>
              </View>
              <View>
                <Text>
                  {status['P'] === 1 ? (
                    <Avatar.Image
                      size={24}
                      source={require('../../assets/running.png')}
                    />
                  ) : status['P'] === 2 ? (
                    // <Avatar.Image
                    //   size={24}
                    //   source={require('../../assets/smallDone.png')}
                    // />
                    response['P'] && (
                      <Text style={{fontWeight: '700', color: '#b0b0b0'}}>
                        {response['P']} Lights are working
                      </Text>
                    )
                  ) : (
                    status['P'] === 3 && (
                      <Avatar.Image
                        size={24}
                        source={require('../../assets/smallFailed.png')}
                      />
                    )
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* mannual test */}
        <View>
          <View style={Styles.header}>
            <Text style={Styles.headerText}>Manual Test</Text>
            <View>
              <Text>
                {TestState.MajorTest === 'Test3' ? (
                  <Avatar.Image
                    size={24}
                    source={require('../../assets/running.png')}
                  />
                ) : TestState.Test3 === '1' ? (
                  <Avatar.Image
                    size={24}
                    source={require('../../assets/done.png')}
                  />
                ) : (
                  TestState.Test3 === '0' && (
                    <Avatar.Image
                      size={24}
                      source={require('../../assets/smallFailed.png')}
                    />
                  )
                )}
              </Text>
            </View>
          </View>
          <View style={Styles.manualConatiner}>
            <Text style={Styles.subSectionText}>Gps On</Text>
            <RadioButton.Group
              onValueChange={(value: any) =>
                setRadioButonValue(prev => {
                  return {...prev, gps: value};
                })
              }
              value={RadioButtonValue.gps}>
              <View style={Styles.manualButtons}>
                <RadioButton value="1" />
                <Text>Yes</Text>
                <RadioButton value="0" />
                <Text>No</Text>
              </View>
            </RadioButton.Group>
          </View>
          <View style={Styles.manualConatiner}>
            <Text style={Styles.subSectionText}>Lights On</Text>
            <RadioButton.Group
              onValueChange={(value: any) =>
                setRadioButonValue(prev => {
                  return {...prev, lights: value};
                })
              }
              value={RadioButtonValue.lights}>
              <View style={Styles.manualButtons}>
                <RadioButton value="1" />
                <Text>Yes</Text>
                <RadioButton value="0" />
                <Text>No</Text>
              </View>
            </RadioButton.Group>
          </View>
          <View style={Styles.submitBtn}>
            <Button
              style={Styles.button}
              uppercase={true}
              buttonColor="#2a2c93"
              mode="contained"
              disabled={TestState.FinalResultSubmitBtn === true ? true : false}
              onPress={e => {
                if (RadioButtonValue.gps && RadioButtonValue.lights) {
                  handleFinalTest(e);
                }
              }}>
              <Text>Submit</Text>
            </Button>
          </View>
          {/* <NativeButton color="#2b2b93" title="OK" onPress={handleFinalTest} /> */}
        </View>

        <ConfirmationModal
          Yes="Yes"
          No="No"
          isVisible={isModalVisible.model1}
          question={modalQuestion}
          onYes={modalHandlers.handleYes}
          onNo={modalHandlers.handleNo}
        />
        <ConfirmationModal
          Yes="Abundant Test"
          No="Fail Test Case"
          isVisible={isModalVisible.model2}
          question={modalQuestion}
          onYes={modalHandlers.handleAbandon}
          onNo={modalHandlers.Continue}
        />
        {/* {errorMessage && <Text>{errorMessage}</Text>} */}
      </View>
    </ScrollView>
  );
};

export default TestScreen;
