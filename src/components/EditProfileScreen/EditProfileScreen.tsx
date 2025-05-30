import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector, useAppDispatch} from '../../redux/store';
import {showSnackbar} from '../../redux/slice/snackbarSlice';
import {fetchUserDetails} from '../../apis/fetchUserDetails';
import {updateUserDetails} from './helpers/updateUserDetails';
import {useQuery} from '@tanstack/react-query';
import AddressManager from '../AddressManager/AddressManager';
import {setUser} from '../../redux/slice/authSlice';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {data: userDetails, isLoading} = useQuery({
    queryKey: ['userDetails'],
    queryFn: () => fetchUserDetails({id: user?.id}),
    select: data => data?.response?.data,
  });

  // Initialize form with user details when they load
  useEffect(() => {
    if (userDetails) {
      setForm({
        name: userDetails.name || '',
        email: userDetails.email || '',
        phone: userDetails.mobile_number || '',
      });
    }
  }, [userDetails]);

  console.log('userDetails', userDetails);

  const handleChange = (key: string, value: string) => {
    setForm(prevForm => ({
      ...prevForm,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      dispatch(
        showSnackbar({
          type: 'error',
          title: 'All fields are required.',
          placement: 'top',
        }),
      );
      return;
    }
    setLoading(true);
    const updatedData = {
      id: user?.id,
      updates: {
        name: form.name,
        mobile_number: form.phone,
      },
    };
    try {
      const apiResponse = await updateUserDetails(updatedData);

      if (apiResponse?.response?.success) {
        dispatch(
          setUser({
            ...user,
            name: form.name,
            mobile_number: form.phone,
          }),
        );
        dispatch(
          showSnackbar({
            type: 'success',
            title: 'Profile updated successfully!',
            placement: 'top',
          }),
        );
      } else {
        dispatch(
          showSnackbar({
            type: 'error',
            title:
              apiResponse?.response?.data?.message ||
              'Failed to update profile.',
            placement: 'top',
          }),
        );
      }
    } catch (error) {
      dispatch(
        showSnackbar({
          type: 'error',
          title: 'Failed to update profile.',
          placement: 'top',
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate fetching updated user data
    setTimeout(() => {
      // Update state with new data if needed
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <LinearGradient colors={['#e3e6ee', '#e3e6ee']} style={styles.gradient}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={handleChange.bind(null, 'name')}
              placeholder="Enter your name"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                {backgroundColor: '#f1f1f1', color: '#888'},
              ]}
              value={form.email}
              onChangeText={handleChange.bind(null, 'email')}
              editable={false}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={form.phone}
              onChangeText={handleChange.bind(null, 'phone')}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
          <AddressManager />
          <TouchableOpacity
            style={[styles.saveButton, loading && {opacity: 0.7}]}
            onPress={handleSave}
            disabled={loading}>
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 16,
    // paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F7F7F7',
    color: '#222',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
