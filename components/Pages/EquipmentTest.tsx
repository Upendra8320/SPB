import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, Text, View, ToastAndroid} from 'react-native';
import {Styles} from '../../Styles/Styles';
import {ConnectionStatusContext} from '../Utils/ConnectionStatusContext';
import {testData} from '../../data';
import { Button } from 'react-native-paper';
import Cards from '../MiniComponents/Cards';
const EquipmentTest = () => {
  const {setSocketConnected} = useContext(ConnectionStatusContext);
  const [socket, setSocket] = useState(null);
  const mainFunction = () => {
    console.log('test started');
  };
  return (
    <ScrollView>
      <View>
        <Button
          style={Styles.button}
          uppercase={true}
          buttonColor="#2a2c93"
          //   disabled={TestState.TestStart ? true : false}
          mode="contained"
          onPress={mainFunction}>
          {/* {TestState.TestStart ? 'Test Started' : 'Start Test'} */}
          Start Test
        </Button>
      </View>
      <Cards test_name={testData[0].test_name} steps={testData[0].steps} />
    </ScrollView>
  );
};

export default EquipmentTest;
