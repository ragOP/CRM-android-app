import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

const LoginValidation = () => {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate('Account', {screen: 'LoginScreen'});
  };

  return (
    <LinearGradient
      colors={['#f8fafc', '#e9efff']}
      style={styles.gradient}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <View style={styles.card}>
        <Text style={styles.title}>Login Required</Text>
        <Text style={styles.message}>
          Please log in to access the cart feature.
        </Text>
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          labelStyle={{fontWeight: 'bold', fontSize: 16}}
          contentStyle={{paddingVertical: 6}}>
          Log In
        </Button>
      </View>
    </LinearGradient>
  );
};

export default LoginValidation;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 28,
  },
  button: {
    borderRadius: 8,
    width: 140,
    backgroundColor: '#2B9AFF',
  },
});
