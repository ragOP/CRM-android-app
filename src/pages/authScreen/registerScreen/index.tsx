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
import CustomInputField from '../../../components/InputFields';
import CustomButton from '../../../components/Button/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {signupUser} from '../../../apis/signupUser';
import {useAppDispatch} from '../../../redux/store';
import {showSnackbar} from '../../../redux/slice/snackbarSlice';

const logo = require('../../../assets/logo.png');

const RegisterScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (key: string, value: string) => {
    setFormData({...formData, [key]: value});
  };

  const handleRegister = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      dispatch(
        showSnackbar({
          type: 'error',
          title: 'Please fill in all fields',
          placement: 'top',
        }),
      );
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      dispatch(
        showSnackbar({
          type: 'error',
          title: 'Passwords do not match',
          placement: 'top',
        }),
      );
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };
      const response = await signupUser({
        payload,
      });
      console.log('Signup response:', response);
      if (response?.response?.success) {
        dispatch(
          showSnackbar({
            type: 'success',
            title: 'Account created successfully!',
            placement: 'top',
          }),
        );
        navigation.navigate('Account', {screen: 'LoginScreen'});
      } else {
        const errorMessage =
          response?.response?.data?.message || 'Signup failed';
        dispatch(
          showSnackbar({
            type: 'error',
            title: errorMessage,
            placement: 'top',
          }),
        );
      }
    } catch (error: any) {
      dispatch(
        showSnackbar({
          type: 'error',
          title: error?.response?.data?.message || 'Something went wrong',
          placement: 'top',
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

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
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Account', {screen: 'LoginScreen'})
                  }>
                  <Text style={styles.linkText}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.middleContainer}>
              <CustomInputField
                label="Name"
                InputWidth={100}
                value={formData.name}
                onChangeText={val => handleChange('name', val)}
              />
              <CustomInputField
                label="Email"
                InputWidth={100}
                value={formData.email}
                onChangeText={val => handleChange('email', val)}
              />
              <CustomInputField
                label="Password"
                InputWidth={100}
                value={formData.password}
                secureTextEntry
                onChangeText={val => handleChange('password', val)}
              />
              <CustomInputField
                label="Confirm Password"
                InputWidth={100}
                value={formData.confirmPassword}
                secureTextEntry
                onChangeText={val => handleChange('confirmPassword', val)}
              />
              <CustomButton
                title={isLoading ? 'Registering...' : 'Register'}
                buttonWidth={100}
                isLoading={isLoading}
                onPress={handleRegister}
              />
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
    paddingTop: 20,
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
