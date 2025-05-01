import React from 'react';
import {View, Text, Button, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from '../../redux/store';
import {logout} from '../../redux/slice/authSlice';
import {useNavigation} from '@react-navigation/native';

const UserProfileScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const handleLogout = async () => {
    // Clear redux state
    dispatch(logout());
    // Remove user data from AsyncStorage
    await AsyncStorage.removeItem('userData');
    Alert.alert('Logged out', 'You have been logged out.');
    // Optionally, navigate to login screen
    navigation.reset({
      index: 0,
      routes: [{name: 'LoginScreen'}],
    });
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>User profile screen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default UserProfileScreen;
