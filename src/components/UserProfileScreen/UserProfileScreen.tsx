import React from 'react';
import {View, Text, Button, Alert, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from '../../redux/store';
import {logout} from '../../redux/slice/authSlice';
import {useNavigation} from '@react-navigation/native';

const UserProfileScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const handleLogout = async () => {
    dispatch(logout());
    await AsyncStorage.removeItem('userData');
    Alert.alert('Logged out', 'You have been logged out.');
    navigation.navigate('LoginScreen');
  };

  const handleViewOrders = () => {
    navigation.navigate('ViewOrderScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <Button title="View Orders" onPress={handleViewOrders} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
