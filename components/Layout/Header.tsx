import React, {useContext} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Avatar} from 'react-native-paper';
import {ConnectionStatusContext} from '../Utils/ConnectionStatusContext';
import {useRoute} from '@react-navigation/native';

const Header = () => {
  const route = useRoute();

  const {socketConnected} = useContext(ConnectionStatusContext);
  // console.log('socketConnected: ', socketConnected);

  console.log(route.name);

  return (
    <View style={styles.maincontainer}>
      <View style={styles.container}>
        <Image source={require('../../assets/logo.png')} style={styles.image} />
        <Text style={styles.text}>SPB STAY READY</Text>
      </View>
      {route.name === 'Test' && (
        <>
          {socketConnected ? (
            <Avatar.Image
              size={24}
              source={require('../../assets/smallDone.png')}
            />
          ) : (
            <Avatar.Image
              size={24}
              source={require('../../assets/smallFailed.png')}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: '#434343',
    fontWeight: '600',
  },
});

export default Header;
