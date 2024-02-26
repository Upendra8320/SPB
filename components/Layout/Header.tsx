import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Header = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/logo.png')}
        style={styles.image}
      />
      <Text style={styles.text}>SPB STAY READY</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
    color:"#434343",
    fontWeight:"600",
  },
});

export default Header;