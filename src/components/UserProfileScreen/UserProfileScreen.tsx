import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {logout} from '../../redux/slice/authSlice';
import {useNavigation} from '@react-navigation/native';
import {showSnackbar} from '../../redux/slice/snackbarSlice';
import CustomDialog from '../CustomDialog/CustomDialog';
import {Chip} from 'react-native-paper';
import { getFirstName } from '../../utils/name/getFirstName';

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

  const handleTransactions = () => {
    navigation.navigate('Account', {screen: 'TransactionLogsScreen'});
  };

  const handleEditPage = () => {
    navigation.navigate('Account', {screen: 'EditProfileScreen'});
  };

  const handleFaq = () => {
    navigation.navigate('Account', {screen: 'FaqScreen'});
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('Account', {screen: 'PrivacyPolicyScreen'});
  };

  const handleTermsConditions = () => {
    navigation.navigate('Account', {screen: 'TermsConditionsScreen'});
  };

  const handleRateUs = () => {
    Linking.openURL(
      'https://play.google.com/store/apps/details?id=com.example.dummyapp',
    );
  };

  return (
    <>
      <View style={{flex: 1, backgroundColor: '#f8f9fa'}}>
        <LinearGradient
          colors={['#6C47FF', '#2B9AFF']}
          style={styles.headerBackground}>
          <Icon
            name="person-circle"
            size={64}
            color="#fff"
            style={{marginLeft: 10}}
          />
          <View style={{flexShrink: 1}}>
            <Text
              style={styles.headerTitle}
              numberOfLines={1}
              ellipsizeMode="tail">
              Hello, {getFirstName(user?.name)} 👋
            </Text>
            <Text
              style={styles.subHeader}
              numberOfLines={1}
              ellipsizeMode="tail">
              {user?.email || 'No Email'}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginTop: 4,
              }}>
              {/* {user?.mobile_number && ( */}
              <Text
                style={styles.mobileNumber}
                numberOfLines={1}
                ellipsizeMode="tail">
                {user?.mobile_number || 98181212121212}
              </Text>
              {/* )} */}

              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>
                  {user?.role?.toUpperCase() || 'USER'}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Account Section */}
          <Text style={styles.section}>🧾 Account</Text>
          <Row
            icon="person-outline"
            label="Edit Profile"
            onPress={handleEditPage}
          />
          <Row
            icon="clipboard-outline"
            label="My Orders"
            onPress={handleViewOrders}
          />
          <Row
            icon="swap-horizontal-outline"
            label="Transaction Logs"
            onPress={handleTransactions}
          />
          <Row
            icon="log-out-outline"
            label="Logout"
            onPress={() => setShowLogoutDialog(true)}
          />

          {/* Policy & Info */}
          <Text style={styles.section}>📄 Info & Policy</Text>
          <Row icon="help-buoy-outline" label="FAQ" onPress={handleFaq} />
          <Row
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={handlePrivacyPolicy}
          />
          <Row
            icon="document-text-outline"
            label="Terms & Conditions"
            onPress={handleTermsConditions}
          />

          {/* Help & Support */}
          <Text style={styles.section}>❓ Help & Support</Text>
          <Row icon="help-circle-outline" label="Help Center" />
          <Row icon="chatbox-ellipses-outline" label="Contact Support" />

          {/* Rate Us */}
          <Text style={styles.section}>⭐ Rate Us</Text>
          <Row icon="star-outline" label="Rate Us" onPress={handleRateUs} />
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
    height: 120,
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
  mobileNumber: {
    color: '#fff',
    fontSize: 13,
    marginTop: 4,
  },
  role: {
    color: '#d9d9d9',
    fontSize: 13,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    paddingBottom: 40,
  },
  section: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
    marginTop: 18,
    marginBottom: 12,
  },
  row: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 13,
    paddingHorizontal: 15,
    marginBottom: 7,
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
  roleBadge: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6C47FF',
    marginLeft: 2,
    marginTop: 4,
  },
  roleBadgeText: {
    color: '#6C47FF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default UserProfileScreen;
