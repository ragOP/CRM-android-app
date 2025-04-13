import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Platform} from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignupScreen from './src/pages/authScreen/signupScreen';
import RegisterScreen from './src/pages/authScreen/registerScreen';
import HomeScreen from './src/pages/homeScreen/index';

// const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      {/* <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name={'home'} component={HomeScreen} />
          <Stack.Screen name={'signup'} component={SignupScreen} />
          <Stack.Screen name={'register'} component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer> */}
      {/* <RegisterScreen /> */}
      <SignupScreen />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
