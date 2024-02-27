import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { lazy } from 'react';
import { StyleSheet } from 'react-native';
import Header from './components/Layout/Header';
import { ConnectionStatusProvider } from './components/Utils/ConnectionStatusContext';
// import ConfigScreen from './components/Pages/ConfigScreen';
// import LogScreen from './components/Pages/LogScreen';
// import TestScreen from './components/Pages/TestScreen';
import HomeScreen from './components/Pages/HomeScreen';

// const Home = lazy(() => import('./components/Pages/HomeScreen'));
const Test = lazy(() => import('./components/Pages/TestScreen'));
const Config = lazy(() => import('./components/Pages/ConfigScreen'));
const Log = lazy(() => import('./components/Pages/LogScreen'));

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <ConnectionStatusProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerTitle: () => <Header />}}
        />
        <Stack.Screen
          name="Test"
          component={Test}
          options={{
            headerTitle: () => <Header />,
          }}
        />
        <Stack.Screen
          name="Log"
          component={Log}
          options={{
            headerTitle: () => <Header />,
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="Config"
          component={Config}
          options={{
            headerTitle: () => <Header />,
            headerLeft: () => null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </ConnectionStatusProvider>
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
