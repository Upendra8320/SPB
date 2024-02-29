import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, Text, View, ToastAndroid, StyleSheet} from 'react-native';
import {ConnectionStatusContext} from '../Utils/ConnectionStatusContext';
import {testData} from '../../data';
import {Button} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
const EquipmentTest = () => {
  const {setSocketConnected} = useContext(ConnectionStatusContext);
  const [socket, setSocket] = useState<any>({});

  useEffect(() => {}, []);

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
    ToastAndroid.show('Manual Test Completed', ToastAndroid.SHORT);
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
      <Button
        style={styles.button}
        uppercase={true}
        buttonColor="#2a2c93"
        // disabled={TestState.TestStart ? true : false}
        mode="contained"
        onPress={mainFunction}>
        {/* {TestState.TestStart ? 'Test Started' : 'Start Test'} */}
        Start Test
      </Button>
      {testData.map(test => (
        <View key={test.id}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{test.test_name}</Text>
            <Text>done </Text>
          </View>
          {test.steps.map(step => {
            console.log(
              'step: ',
              step.step_command === status[step.step_command],
            );
            return (
              <View key={step.id} style={styles.subSectionContainer}>
                <Text style={styles.subSectionText}>{step.step_name}</Text>
                <Text>{status[step.step_command]}</Text>
              </View>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 6,
    fontSize: 100,
    fontWeight: '700',
    borderRadius: 8,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  header: {
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2f1ff',
    padding: 25,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 10,
  },
  headerText: {
    fontSize: 22,
    color: '#4e4e50',
    fontWeight: '500',
  },
  highlight: {
    fontWeight: '700',
  },
  subSection: {
    backgroundColor: '#f7f7f7',
    marginTop: 2,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 10,
  },
  subSectionContainer: {
    height: 45,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  subSectionText: {
    fontSize: 14,
    color: '#4e4e50',
    fontWeight: '500',
  },
});
export default EquipmentTest;

// create stylesheet
