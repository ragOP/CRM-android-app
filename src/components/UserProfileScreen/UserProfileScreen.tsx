import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {logout} from '../../redux/slice/authSlice';
import {useNavigation} from '@react-navigation/native';
import {showSnackbar} from '../../redux/slice/snackbarSlice';
import CustomDialog from '../CustomDialog/CustomDialog';

const Row = ({icon, label, onPress, rightComponent}) => (
  <Pressable onPress={onPress} style={styles.row}>
    <View style={styles.iconLabel}>
      <Icon name={icon} size={20} color="#333" />
      <Text style={styles.label}>{label}</Text>
    </View>
    {rightComponent ?? <Icon name="chevron-forward" size={18} color="#999" />}
  </Pressable>
);

const UserProfileScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const user = useAppSelector(state => state.auth.user);
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    dispatch(logout());
    await AsyncStorage.removeItem('userData');
    dispatch(
      showSnackbar({
        type: 'info',
        title: 'Logged out successfully!',
        placement: 'top',
      }),
    );
    navigation.navigate('Account', {screen: 'LoginScreen'});
  };

  const handleViewOrders = () => {
    navigation.navigate('Account', {screen: 'ViewOrderScreen'});
  };

  return (
    <>
      <View style={{flex: 1, backgroundColor: '#f8f9fa'}}>
        <LinearGradient
          colors={['#6C47FF', '#2B9AFF']}
          style={styles.headerBackground}>
          <Icon name="person-circle" size={64} color="#fff" />
          <View>
            <Text style={styles.headerTitle}>
              Hello, {user?.name || 'Guest'} 👋
            </Text>
            <Text style={styles.subHeader}>{user?.email || 'No Email'}</Text>
            <Text style={styles.role}>
              Role: {user?.role?.toUpperCase() || 'USER'}
            </Text>
          </View>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Personal Info */}
          {/* <Text style={styles.section}>👤 Personal Information</Text>
          <Row icon="edit" label={"Edit Profile"} /> */}

          {/* Orders */}
          <Text style={styles.section}>🧾 Account</Text>
          <Row icon="person-outline" label={'Edit Profile'} />

          <Row
            icon="clipboard-outline"
            label="My Orders"
            onPress={handleViewOrders}
          />

          {/* Preferences */}
          {/* <Text style={styles.section}>⚙️ Preferences</Text>
        <Row
          icon="moon-outline"
          label="Dark Mode"
          rightComponent={
            <Switch value={darkMode} onValueChange={setDarkMode} />
          }
        />
        <Row icon="language-outline" label="Language: English" /> */}

          {/* App Settings */}
          {/* <Text style={styles.section}>🛠️ App Settings</Text>
        <Row icon="lock-closed-outline" label="Change Password" />
        <Row icon="notifications-outline" label="Notification Settings" /> */}

          {/* Help & Support */}
          <Text style={styles.section}>❓ Help & Support</Text>
          <Row icon="help-circle-outline" label="Help Center" />
          {/* <Row icon="document-text-outline" label="Terms & Conditions" /> */}
          <Row icon="chatbox-ellipses-outline" label="Contact Support" />

          {/* Logout */}
          <Text style={styles.section}>🔓 Account</Text>
          <Row
            icon="log-out-outline"
            label="Logout"
            onPress={() => setShowLogoutDialog(true)}
          />
        </ScrollView>
      </View>

      <CustomDialog
        visible={showLogoutDialog}
        title="Logout"
        message="Are you sure you want to logout?"
        primaryLabel="Confirm"
        primaryAction={() => {
          setShowLogoutDialog(false);
          handleLogout();
        }}
        secondaryLabel="Cancel"
        secondaryAction={() => setShowLogoutDialog(false)}
        onDismiss={() => setShowLogoutDialog(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    gap: 10,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  subHeader: {
    color: '#f1f1f1',
    fontSize: 14,
    marginTop: 2,
  },
  role: {
    color: '#d9d9d9',
    fontSize: 13,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    paddingBottom: 80,
  },
  section: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginTop: 28,
    marginBottom: 10,
  },
  row: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 15,
    color: '#333',
  },
});

export default UserProfileScreen;
