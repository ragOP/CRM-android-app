import { View, Text, SafeAreaView, StatusBar, StyleSheet, Platform } from 'react-native';
import React from 'react';
import SignupScreen from './src/pages/authScreen/signupScreen';
import RegisterScreen from './src/pages/authScreen/registerScreen';

const App = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SignupScreen />
      {/* <RegisterScreen /> */}
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
