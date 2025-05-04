import React from 'react';
import {View, Text, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {logout} from '../../redux/slice/authSlice';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const UserProfileScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  // Get user data from Redux store
  const user = useAppSelector(state => state.auth.user);

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
      <View style={styles.profileCard}>
        <Icon name="person-circle-outline" size={80} color="#007AFF" />
        <Text style={styles.name}>{user?.name || 'Guest User'}</Text>
        <Text style={styles.email}>{user?.email || 'No email available'}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleViewOrders}>
        <Icon name="list-outline" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>View Orders</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}>
        <Icon
          name="log-out-outline"
          size={20}
          color="#fff"
          style={styles.icon}
        />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '90%',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '90%',
    justifyContent: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  icon: {
    marginRight: 8,
  },
});
