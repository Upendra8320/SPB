import React from 'react';
import {StyleSheet, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Header from './components/Layout/Header';
import ConfigScreen from './components/Pages/ConfigScreen';
import HomeScreen from './components/Pages/HomeScreen';
import LogScreen from './components/Pages/LogScreen';
import TestScreen from './components/Pages/TestScreen';
const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerTitle: () => <Header />}}
        />
        <Stack.Screen
          name="Test"
          component={TestScreen}
          options={{
            headerTitle: () => <Header />,
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="Log"
          component={LogScreen}
          options={{
            headerTitle: () => <Header />,
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="Config"
          component={ConfigScreen}
          options={{
            headerTitle: () => <Header />,
            headerLeft: () => null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
