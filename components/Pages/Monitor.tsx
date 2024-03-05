import React, { useContext, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { ConnectionStatusContext } from '../Utils/ConnectionStatusContext';

const TestScreen = () => {
  const {setSocketConnected} = useContext(ConnectionStatusContext);
  const [socket, setSocket] = useState<any>({});
  const [data, setData] = useState<any>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  //
  const terminology: any = {
    B: 'fireman_pump_Switch_Status',
    C: 'fireman_pump_current',
    D: 'is_fireman_pump_ok',
    L: 'CH_6_AC',
    N: 'navigation_light_switch_status',
    O: 'navigation_light_current',
    P: 'is_navigation_light_ok',
    Z: 'CH_7_DC',
  };

  useEffect(() => {
    const socket = new WebSocket(process.env.WEB_SOCKET!);

    const onMessage = (e: any) => {
      //   setData((prev: any) => prev.concat(e.data));
      setData((prev: any) => [...prev, e.data]);
      scrollViewRef.current?.scrollToEnd({animated: true});
    };

    socket.onopen = () => {
      setSocketConnected(true);
      socket.send('R');
    };

    socket.onmessage = onMessage;

    socket.onerror = (e: any) => {
      ToastAndroid.show('Connection Error', ToastAndroid.SHORT);
      setSocketConnected(false);
    };
    socket.onclose = (e: any) => {
      setSocketConnected(false);
    };
    setSocket(socket);
    // sendCommandAndReceiveResponse();
    return () => {
      socket.send('r');
      socket.close();
      setSocketConnected(false);
      ToastAndroid.show('Connection Closed', ToastAndroid.SHORT);
    };
  }, [setSocketConnected]);

  const renderItem = (list: any, index: number) => {
    const listArray = list.split(',');
    const key = listArray[0];
    const value = listArray[1];
    const isLastItem = key === 'Z';

    return (
      <View
        key={index}
        style={
          isLastItem ? styles.itemContainerWithBreak : styles.itemContainer
        }>
        <Text style={styles.textStyle}>{terminology[key]}</Text>
        <Text style={styles.textStyle}>{value}</Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView
        ref={scrollViewRef} // Attach the ref to the ScrollView
        style={{flex: 1}}>
        <View style={{margin: 15}}>
          <Text style={{color: '#3f3f3f', fontSize: 18, fontWeight: '700'}}>
            Device Diagnostic
          </Text>
        </View>
        <View>
          {data.map((list: any, index: number) => renderItem(list, index))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
  },
  itemContainerWithBreak: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10, // Increase the bottom margin to add a break
    borderBottomWidth: 2,
    paddingBottom: 10,
  },
  textStyle: {
    color: '#15384e',
  },
});

export default TestScreen;
