import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const logo = require('../../../assets/logo.png');
import CustomInputField from '../../../components/InputFields';
import CustomButton from '../../../components/Button';

const SignupScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.mainContainer}>
          <View style={styles.topContainer}>
            <Image style={styles.images} source={logo} />
            <Text style={styles.topText}>Sign in to your Account</Text>
            <View style={styles.row}>
              <Text style={styles.normalText}>Don't have an account? </Text>
              <TouchableOpacity>
                <Text style={styles.linkText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.middleContainer}>
            <CustomInputField label="Mobile Number" InputWidth={100} numeric={true}/>
            <CustomInputField label="Password" InputWidth={100} secureTextEntry />
            <CustomButton title="Log In" buttonWidth={100} isLoading={isLoading} />
          </View>

          <View style={styles.bottomContainer}>
            <Text style={styles.footerText}>
              By signing up, you agree to the{' '}
              <Text style={{ fontWeight: 'bold', color: '#000' }}>
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text style={{ fontWeight: 'bold', color: '#000' }}>
                Data Processing Agreement
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topContainer: {
    backgroundColor: '#00008B',
    width: '100%',
    padding: 30,
    paddingTop: 30,
  },
  bottomContainer: {
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 30
  },
  middleContainer: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 30,
  },
  topText: {
    fontSize: 32,
    lineHeight: 38,
    color: '#fff',
    marginTop: 5,
    fontFamily: 'Popins',
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    marginTop: 15,
    alignContent: 'center',
    gap: 2,
  },
  normalText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Popins',
  },
  linkText: {
    fontSize: 16,
    color: '#82C8E5',
    textDecorationLine: 'underline',
    fontFamily: 'Popins',
  },
  images: {
    width: 120,
    height: 70,
    resizeMode: 'contain',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Popins',
    color: '#6C7278',
  },
});
