import React, {Dispatch, SetStateAction, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useQuery} from '@tanstack/react-query';
import {fetchUserDistributors} from '../../apis/fetchUserDistributors';
import {useAppSelector} from '../../redux/store';
import {isArrayWithValues} from '../../utils/array/isArrayWithValues';

type OrderForSelectionProps = {
  selectedUser: string | null;
  setSelectedUser: Dispatch<SetStateAction<string | null>>;
};

const OrderForSelection = ({
  selectedUser,
  setSelectedUser,
}: OrderForSelectionProps) => {
  const [selectedCount, setSelectedCount] = useState<string>('1');
  const [customCount, setCustomCount] = useState<string>('');

  const reduxAuth = useAppSelector(state => state.auth);
  const reduxUser = reduxAuth.user;
  const reduxRole = reduxUser?.role;

  const distributorsParams = {role: 'user'};

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['fetch_distributors'],
    queryFn: () => fetchUserDistributors({params: distributorsParams}),
    select: data => data?.response?.data,
  });

  if (isError) {
    Alert.alert('Error', 'Failed to fetch users. Please try again.');
  }

  const isCustomCount = selectedCount === 'custom';

  return (
    <View style={styles.container}>
      {(reduxRole === 'dnd' || reduxRole === 'salesperson') && (
        <>
          <Text style={styles.label}>
            {reduxRole === 'dnd'
              ? 'Select Your Salesperson'
              : 'Select Your Doctor/Distributor'}
          </Text>
          <View style={styles.pickerContainer}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#00008B" />
            ) : (
              <Picker
                selectedValue={selectedUser}
                onValueChange={itemValue => setSelectedUser(itemValue)}
                style={styles.picker}>
                <Picker.Item label="Select a user" value={null} />
                {isArrayWithValues(users) ? (
                  users?.map((user: any) => (
                    <Picker.Item
                      key={user?._id}
                      label={user?.name}
                      value={user?._id}
                    />
                  ))
                ) : (
                  <Picker.Item label="No users available" value={null} />
                )}
              </Picker>
            )}
          </View>

          {/* Count Picker */}
          {/* <Text style={[styles.label, {marginTop: 16}]}>Select Count</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCount}
              onValueChange={value => setSelectedCount(value)}
              style={styles.picker}>
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="10" value="10" />
              <Picker.Item label="Custom" value="custom" />
            </Picker>
          </View> */}

          {isCustomCount && (
            <TextInput
              placeholder="Enter custom count"
              keyboardType="numeric"
              value={customCount}
              onChangeText={setCustomCount}
              style={styles.input}
            />
          )}
        </>
      )}
    </View>
  );
};

export default OrderForSelection;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#00008B',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    marginTop: 10,
    height: 50,
    borderWidth: 1,
    borderColor: '#00008B',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
});
