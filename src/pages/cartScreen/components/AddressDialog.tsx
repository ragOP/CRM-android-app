import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {updateAddress} from '../../../apis/updateAddress';
import {useAppSelector} from '../../../redux/store';
import {addAddress} from '../../../apis/addAddress';
import {deleteAddress} from '../../../apis/deleteAddress';

export type AddressType = 'home' | 'work' | 'other';

export interface Address {
  _id: string;
  name: string;
  mobile: string;
  pincode: string;
  locality: string;
  address: string;
  city: string;
  state: string;
  landmark?: string;
  alternatePhone?: string;
  addressType: AddressType;
}

const addressInit: Omit<Address, '_id'> = {
  name: '',
  mobile: '',
  pincode: '',
  locality: '',
  address: '',
  city: '',
  state: '',
  landmark: '',
  alternatePhone: '',
  addressType: 'home',
};

export interface AddressDialogProps {
  visible: boolean;
  addresses: Address[];
  onClose: () => void;
  onSelect: (addr: Address) => void;
  currentAddress: Address | null;
}

const AddressDialog: React.FC<AddressDialogProps> = ({
  visible,
  addresses = [],
  onClose,
  onSelect,
  currentAddress,
}) => {
  const queryClient = useQueryClient();

  const reduxUser = useAppSelector(state => state.auth.user);
  const reduxUserId = reduxUser?.id;

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Address, '_id'>>(addressInit);
  const [isLoading, setIsLoading] = useState(false);

  const {mutate: createAddress} = useMutation({
    mutationFn: async ({address}: {address: Omit<Address, '_id'>}) => {
      if (!reduxUserId) {
        return;
      }
      const payload = {
        ...(address || {}),
        user: reduxUserId,
      };
      const apiResponse = await addAddress({payload});
      return apiResponse?.response;
    },
    onMutate: () => setIsLoading(true),
    onSuccess: res => {
      setIsLoading(false);
      if (res?.success) {
        queryClient.invalidateQueries({queryKey: ['user_addresses']});
        Alert.alert('Success', 'Address added successfully');
        setEditId(null);
      } else {
        Alert.alert('Error', res?.message || 'Failed to add address');
      }
    },
    onError: error => {
      setIsLoading(false);
      console.error('ERROR', error);
      Alert.alert('Error', 'Failed to add address');
    },
  });

  const {mutate: modifyAddress} = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Omit<Address, '_id'>;
    }) => {
      const apiResponse = await updateAddress({id, payload});
      return apiResponse?.response;
    },
    onMutate: () => setIsLoading(true),
    onSuccess: res => {
      setIsLoading(false);
      if (res?.success) {
        queryClient.invalidateQueries({queryKey: ['user_addresses']});
        Alert.alert('Success', 'Address updated successfully');
        setEditId(null);
      } else {
        Alert.alert('Error', res?.message || 'Failed to update address');
      }
    },
    onError: error => {
      setIsLoading(false);
      console.error('ERROR', error);
      Alert.alert('Error', 'Failed to update address');
    },
  });

  const {mutate: removeAddress} = useMutation({
    mutationFn: async ({id}: {id: string}) => {
      const apiResponse = await deleteAddress({id});
      return apiResponse?.response;
    },
    onMutate: () => setIsLoading(true),
    onSuccess: res => {
      setIsLoading(false);
      if (res?.success) {
        queryClient.invalidateQueries({queryKey: ['user_addresses']});
        Alert.alert('Success', 'Address deleted successfully');
      } else {
        Alert.alert('Error', res?.message || 'Failed to delete address');
      }
    },
    onError: error => {
      setIsLoading(false);
      console.error('ERROR', error);
      Alert.alert('Error', 'Failed to delete address');
    },
  });

  const onSave = () => {
    const requiredFields: (keyof typeof form)[] = [
      'name',
      'mobile',
      'pincode',
      'locality',
      'address',
      'city',
      'state',
    ];
    for (let field of requiredFields) {
      if (!form[field]?.trim()) {
        Alert.alert('Error', 'Please fill all required fields');
        return;
      }
    }
    if (editId) {
      modifyAddress({id: editId, payload: form});
    } else {
      createAddress({address: form});
    }
    setShowForm(false);
  };

  const startEdit = (addr: Address) => {
    setForm({...addr});
    setEditId(addr._id);
    setShowForm(true);
  };

  const confirmDelete = (id: string) => {
    if (!id) {
      return;
    }
    Alert.alert('Delete', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeAddress({id}),
      },
    ]);
  };

  const renderItem = ({item}: {item: Address}) => {
    const isSelected = currentAddress?._id === item?._id;
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => {
          onSelect(item);
          onClose();
        }}
        activeOpacity={0.6}>
        <View style={styles.cardContent}>
          <Text style={styles.name}>
            {item.name} <Text style={styles.type}>({item.addressType})</Text>
          </Text>
          <Text style={styles.line}>
            {item.address}, {item.locality}
          </Text>
          <Text style={styles.line}>
            {item.city}, {item.state} - {item.pincode}
          </Text>
          <Text style={styles.line}>📞 {item.mobile}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => startEdit(item)}
            style={styles.actionButton}>
            <Icon name="pencil" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => confirmDelete(item._id)}
            style={styles.actionButton}>
            <Icon name="trash" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (!showForm) {
      setForm(addressInit);
      setEditId(null);
    }
  }, [visible, showForm]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.dialog}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {showForm
                  ? editId
                    ? 'Edit Address'
                    : 'Add New Address'
                  : 'Saved Addresses'}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            {isLoading ? (
              <ActivityIndicator
                size="large"
                color="#007AFF"
                style={styles.loader}
              />
            ) : showForm ? (
              <ScrollView contentContainerStyle={styles.scrollContent}>
                {[
                  {key: 'name', placeholder: 'Full Name', keyboard: 'default'},
                  {
                    key: 'mobile',
                    placeholder: 'Mobile Number',
                    keyboard: 'phone-pad',
                  },
                  {key: 'pincode', placeholder: 'Pincode', keyboard: 'numeric'},
                  {
                    key: 'locality',
                    placeholder: 'Locality',
                    keyboard: 'default',
                  },
                  {
                    key: 'address',
                    placeholder: 'Full Address',
                    keyboard: 'default',
                    multiline: true,
                  },
                  {key: 'city', placeholder: 'City', keyboard: 'default'},
                  {key: 'state', placeholder: 'State', keyboard: 'default'},
                  {
                    key: 'landmark',
                    placeholder: 'Landmark (Optional)',
                    keyboard: 'default',
                  },
                  {
                    key: 'alternatePhone',
                    placeholder: 'Alternate Phone (Optional)',
                    keyboard: 'phone-pad',
                  },
                ].map(({key, placeholder, keyboard, multiline}) => (
                  <TextInput
                    key={key}
                    style={[styles.input, multiline && styles.multilineInput]}
                    placeholder={placeholder}
                    keyboardType={keyboard as any}
                    multiline={!!multiline}
                    value={(form as any)[key]}
                    onChangeText={text =>
                      setForm(prev => ({...prev, [key]: text}))
                    }
                  />
                ))}
                <View style={styles.types}>
                  {['home', 'work', 'other'].map(t => (
                    <TouchableOpacity
                      key={t}
                      style={[
                        styles.typeBtn,
                        form.addressType === t && styles.typeBtnActive,
                      ]}
                      onPress={() =>
                        setForm(prev => ({
                          ...prev,
                          addressType: t as AddressType,
                        }))
                      }>
                      <Text
                        style={[
                          styles.typeText,
                          form.addressType === t && styles.typeTextActive,
                        ]}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.footerBtns}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setShowForm(false)}>
                    <Text style={styles.cancelTxt}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
                    <Text style={styles.saveTxt}>
                      {editId ? 'Update' : 'Save'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            ) : (
              <FlatList
                data={addresses}
                keyExtractor={i => i._id}
                renderItem={renderItem}
                contentContainerStyle={styles.flatListContent}
                ListEmptyComponent={
                  <Text style={styles.empty}>No addresses saved.</Text>
                }
              />
            )}
            {!showForm && (
              <TouchableOpacity
                style={styles.addNew}
                onPress={() => setShowForm(true)}
                disabled={addresses?.length >= 3}>
                <Text style={styles.addNewTxt}>+ Add New Address</Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default AddressDialog;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {width: '100%', paddingHorizontal: 16},
  dialog: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    maxHeight: '90%',
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {fontSize: 18, fontWeight: '600', color: '#333'},
  divider: {height: 1, backgroundColor: '#EEE'},
  loader: {
    marginTop: 20,
    alignSelf: 'center',
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  flatListContent: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  cardContent: {
    flex: 1,
  },
  name: {fontSize: 15, fontWeight: '500', marginBottom: 4},
  type: {fontSize: 13, color: '#666', fontWeight: '400'},
  line: {fontSize: 13, color: '#555', marginBottom: 2},
  actions: {justifyContent: 'center', alignItems: 'center', paddingLeft: 8},
  actionButton: {
    marginBottom: 12,
  },
  empty: {textAlign: 'center', padding: 20, color: '#888'},
  addNew: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#EEE',
    alignItems: 'center',
  },
  addNewTxt: {color: '#007AFF', fontWeight: '600'},
  input: {
    backgroundColor: '#FFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  multilineInput: {
    height: 60,
  },
  types: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  typeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  typeBtnActive: {backgroundColor: '#007AFF', borderColor: '#007AFF'},
  typeText: {fontSize: 14, color: '#555'},
  typeTextActive: {color: '#FFF'},
  footerBtns: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ececec',
  },
  cancelBtn: {marginRight: 12},
  selectedCard: {
    borderWidth: 2,
    borderColor: '#007AFF',
    backgroundColor: '#E6F0FF',
  },
  cancelTxt: {
    color: '#007AFF',
    fontSize: 16,
    padding: 8,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#007AFF',
  },
  saveBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  saveTxt: {color: '#FFF', fontSize: 16},
});
