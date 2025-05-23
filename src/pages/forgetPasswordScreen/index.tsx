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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CustomInputField from '../../components/InputFields';
import CustomButton from '../../components/Button';
import {useAppDispatch} from '../../redux/store';
import {showSnackbar} from '../../redux/slice/snackbarSlice';
import {forgetPassword} from '../../apis/forgetPassword';

const logo = require('../../assets/logo.png');

const ForgetPasswordScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      dispatch(
        showSnackbar({
          type: 'error',
          title: 'Please enter your email address',
          placement: 'top',
        }),
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await forgetPassword({
        payload: {
          email,
        },
      });
      if (response?.response?.success) {
        dispatch(
          showSnackbar({
            type: 'success',
            title: 'Password reset link sent to your email',
            placement: 'top',
          }),
        );
        setTimeout(() => {
          navigation.navigate('Account', {screen: 'LoginScreen'});
        }, 2000);
      } else {
        const errorMessage =
          response?.response?.message || 'Failed to send reset link';
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
          title:
            error?.response?.message ||
            'Failed to send reset link. Please try again.',
          placement: 'top',
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.mainContainer}>
          <View style={styles.topContainer}>
            <Image style={styles.images} source={logo} />
            <Text style={styles.topText}>Reset Password</Text>
            <View style={styles.row}>
              <Text style={styles.normalText}>Remember your password? </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Account', {screen: 'LoginScreen'})
                }>
                <Text style={styles.linkText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.middleContainer}>
            <Text style={styles.instructionText}>
              Enter your email address and we'll send you instructions to reset
              your password.
            </Text>
            <CustomInputField
              label="Email"
              InputWidth={100}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
            />
            <CustomButton
              title={isLoading ? 'Sending...' : 'Send Reset Link'}
              buttonWidth={100}
              isLoading={isLoading}
              onPress={handleResetPassword}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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
  instructionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
});

export default ForgetPasswordScreen;
