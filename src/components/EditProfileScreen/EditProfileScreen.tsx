import React, {useState, useCallback} from 'react';
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

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
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
    try {
      // Call your API to update the profile
      // await updateUserProfile({ name, email, phone });
      dispatch(
        showSnackbar({
          type: 'success',
          title: 'Profile updated successfully!',
          placement: 'top',
        }),
      );
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
    <LinearGradient colors={['#e3e6ee', '#bfc8e4']} style={styles.gradient}>
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
              <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
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
              value={email}
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
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>
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
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#00008B',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00008B',
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
    borderColor: '#00008B',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F7F7F7',
    color: '#222',
  },
  saveButton: {
    backgroundColor: '#00008B',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
