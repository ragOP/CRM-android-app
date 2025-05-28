import React, {Dispatch, SetStateAction, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useQuery} from '@tanstack/react-query';
import {fetchUserDistributors} from '../../apis/fetchUserDistributors';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {isArrayWithValues} from '../../utils/array/isArrayWithValues';
import {showSnackbar} from '../../redux/slice/snackbarSlice';

type OrderForSelectionProps = {
  selectedUser: string | null;
  setSelectedUser: Dispatch<SetStateAction<string | null>>;
  removeBackground: boolean;
};

const OrderForSelection = ({
  selectedUser,
  setSelectedUser,
  removeBackground = false,
}: OrderForSelectionProps) => {
  const dispatch = useAppDispatch();

  const reduxAuth = useAppSelector(state => state.auth);
  const reduxUser = reduxAuth.user;
  const reduxRole = reduxUser?.role;

  const distributorsParams = {
    role: reduxRole === 'dnd' ? 'salesperson' : 'user',
  };

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
    dispatch(
      showSnackbar({
        type: 'error',
        title: 'Failed to fetch users. Please try again.',
        placement: 'top',
      }),
    );
  }

  useEffect(() => {
    if (isArrayWithValues(users) && !selectedUser && users[0]?._id) {
      setSelectedUser(users[0]._id);
    }
  }, [users, selectedUser, setSelectedUser]);

  return (
    <View style={!removeBackground ? styles.container : {}}>
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
                {/* <Picker.Item label="Select a user" value={null} /> */}
                {isArrayWithValues(users) ? (
                  users?.map((user: any) => (
                    <Picker.Item
                      key={user?._id}
                      label={user?.name}
                      value={user?._id}
                      color={selectedUser === user?._id ? '#00008B' : '#222'}
                      style={[
                        styles.pickerItem,
                        selectedUser === user?._id && styles.selectedPickerItem,
                      ]}
                    />
                  ))
                ) : (
                  <Picker.Item label="No users available" value={null} />
                )}
              </Picker>
            )}
          </View>
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
  pickerItem: {
    fontSize: 16,
    paddingVertical: 14,
    backgroundColor: '#F7F7F7',
  },
  selectedPickerItem: {
    color: '#00008B',
    fontWeight: 'bold',
  },
});
