import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const LoginValidation = () => {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate('AccountStack', {screen: 'LoginScreen'});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        You need to log in to access the cart feature.
      </Text>
      <Button title="Log In" onPress={handleLogin} />
    </View>
  );
};

export default LoginValidation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});
