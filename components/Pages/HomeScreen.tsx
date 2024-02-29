import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-paper';

const HomeScreen = ({navigation}: {navigation: any}) => {
  const saveConfigLogs = async () => {
    try {
      const getConfigValue = await AsyncStorage.getItem('@config_logs');
      const savedConfig = getConfigValue != null && JSON.parse(getConfigValue);
      if (savedConfig) return;
      const defaultConfig = JSON.stringify({motorValue: '2', engineValue: '2'});
      await AsyncStorage.setItem('@config_logs', defaultConfig);
    } catch (e) {}
  };

  useEffect(() => {
    saveConfigLogs();
  }, []);

  return (
    <View style={styles.container}>
      <Button
        style={{width: '70%', borderRadius: 8}}
        buttonColor="#111b69"
        mode="contained"
        onPress={() => navigation.navigate('Test')}>
        <Text style={styles.text}> Pre-Sailing Check</Text>
      </Button>
      <Button
        style={{width: '70%', borderRadius: 8}}
        buttonColor="#111b69"
        mode="contained"
        onPress={() => navigation.navigate('Log')}>
        <Text style={styles.text}>Ops Check History</Text>
      </Button>
      <Button
        style={{width: '70%', borderRadius: 8}}
        buttonColor="#111b69"
        mode="contained"
        onPress={() => navigation.navigate('Config')}>
        <Text style={styles.text}>Settings</Text>
      </Button>
      <Button
        style={{width: '70%', borderRadius: 8}}
        buttonColor="#111b69"
        mode="contained"
        onPress={() => navigation.navigate('Scanner')}>
        <Text style={styles.text}>Scanner</Text>
      </Button>
      <View style={styles.imageView}>
        <Image source={require('../../assets/logo.png')} style={styles.image} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
  image: {
    width: '65%',
    height: '100%',
  },
  imageView: {
    // borderWidth:1,
    display: 'flex',
    // justifyContent: "center",
    alignItems: 'center',
    width: '60%',
    height: '20%',
  },
});

export default HomeScreen;
