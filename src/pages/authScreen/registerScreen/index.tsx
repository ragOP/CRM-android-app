import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
const logo = require('../../../assets/logo.png');
import CustomInputField from '../../../components/InputFields';

const RegisterScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.mainContainer}>
            <View style={styles.topContainer}>
              <Image style={styles.images} source={logo} />
              <Text style={styles.topText}>Register</Text>
              <View style={styles.row}>
                <Text style={styles.normalText}>Already have an account?</Text>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.middleContainer}>
              <View style={styles.row}>
                <CustomInputField label="First Name" InputWidth={50} />
                <CustomInputField label="Last Name" InputWidth={50} />
              </View>
              <CustomInputField label="Email" InputWidth={100} />
              <CustomInputField label="Date of Birth" InputWidth={100} />
              <CustomInputField
                label="Mobile Number"
                InputWidth={100}
                numeric={true}
              />
              <CustomInputField
                label="Password"
                InputWidth={100}
                secureTextEntry={true}
              />
              {/* <CustomButton
                title="Register"
                buttonWidth={100}
                isLoading={isLoading}
              /> */}
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  mainContainer: {
    flex: 1,
  },
  topContainer: {
    backgroundColor: '#00008B',
    padding: 20,
  },
  middleContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingTop: 20
  },
  topText: {
    fontSize: 33,
    lineHeight: 44,
    color: '#fff',
    marginTop: 5,
    fontFamily: 'Popins',
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    marginTop: 5,
    alignContent: 'center',
    gap: 5,
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
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Popins',
    color: '#6C7278',
  },
});
