import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {updateAddress} from '../../../apis/updateAddress';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {addAddress} from '../../../apis/addAddress';
import {deleteAddress} from '../../../apis/deleteAddress';
import {showSnackbar} from '../../../redux/slice/snackbarSlice';
import {Badge, Checkbox} from 'react-native-paper';
import {statesList} from '../../../utils/state/statesList';

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
  isPrimary?: boolean;
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
  isPrimary: false,
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
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const reduxUser = useAppSelector(state => state.auth.user);
  const reduxUserId = reduxUser?.id;

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Address, '_id'>>(addressInit);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [stateMenuVisible, setStateMenuVisible] = useState(false);

  const {mutate: createAddress} = useMutation({
    mutationFn: async ({address}: {address: Omit<Address, '_id'>}) => {
      if (!reduxUserId) {
        return;
      }

      const matchedState = statesList.find(
        item => item.name.toLowerCase() === address.state.toLowerCase(),
      );

      const state_code = matchedState?.code || '';

      const payload = {
        ...(address || {}),
        user: reduxUserId,
        state_code,
      };
      const apiResponse = await addAddress({payload});
      return apiResponse?.response;
    },
    onMutate: () => setIsLoading(true),
    onSuccess: res => {
      setIsLoading(false);
      if (res?.success) {
        queryClient.invalidateQueries({queryKey: ['user_addresses']});
        dispatch(
          showSnackbar({
            type: 'success',
            title: 'Address added successfully',
            placement: 'top',
          }),
        );
        setEditId(null);
      } else {
        dispatch(
          showSnackbar({
            type: 'error',
            title: res?.message || 'Failed to add address',
            placement: 'top',
          }),
        );
      }
    },
    onError: error => {
      setIsLoading(false);
      dispatch(
        showSnackbar({
          type: 'error',
          title: 'Failed to add address',
          placement: 'top',
        }),
      );
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
      console.log('apiResponseAddress', apiResponse);
      return apiResponse?.response;
    },
    onMutate: () => setIsLoading(true),
    onSuccess: res => {
      setIsLoading(false);
      if (res?.success) {
        queryClient.invalidateQueries({queryKey: ['user_addresses']});
        dispatch(
          showSnackbar({
            type: 'success',
            title: 'Address updated successfully',
            placement: 'top',
          }),
        );
        setEditId(null);
      } else {
        dispatch(
          showSnackbar({
            type: 'error',
            title: res?.message || 'Failed to update address',
            placement: 'top',
          }),
        );
      }
    },
    onError: error => {
      setIsLoading(false);
      console.error('Error', error);
      dispatch(
        showSnackbar({
          type: 'error',
          title: 'Failed to update address',
          placement: 'top',
        }),
      );
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
        dispatch(
          showSnackbar({
            type: 'success',
            title: 'Address deleted successfully',
            placement: 'top',
          }),
        );
      } else {
        dispatch(
          showSnackbar({
            type: 'error',
            title: res?.message || 'Failed to delete address',
            placement: 'top',
          }),
        );
      }
    },
    onError: error => {
      setIsLoading(false);
      console.error('ERROR', error);
      dispatch(
        showSnackbar({
          type: 'error',
          title: 'Failed to delete address',
          placement: 'top',
        }),
      );
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
        dispatch(
          showSnackbar({
            type: 'error',
            title: `Please fill ${field}`,
            placement: 'top',
          }),
        );
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
    console.log('confirmDelete', id);
    if (!id) {
      return;
    }

    setSelectedAddressId(id);
    setShowLoginDialog(true);
  };

  console.log('addresses', showLoginDialog);

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
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.name}>
                {item.name}{' '}
                <Text style={styles.type}>({item.addressType})</Text>
              </Text>
            </View>
            {item.isPrimary && (
              <View style={styles.primaryBadge}>
                <Text style={styles.primaryBadgeText}>Primary</Text>
              </View>
            )}
          </View>

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
    <>
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
                    {
                      key: 'name',
                      placeholder: 'Full Name',
                      keyboard: 'default',
                    },
                    {
                      key: 'mobile',
                      placeholder: 'Mobile Number',
                      keyboard: 'phone-pad',
                    },
                    {
                      key: 'pincode',
                      placeholder: 'Pincode',
                      keyboard: 'numeric',
                    },
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

                  <TouchableOpacity
                    onPress={() => setStateMenuVisible(prev => !prev)}
                    style={styles.dropdownButton}>
                    <Text>{form.state || 'Select State'}</Text>
                  </TouchableOpacity>

                  {stateMenuVisible && (
                    <View style={styles.dropdownMenu}>
                      <ScrollView style={{maxHeight: 200}}>
                        {statesList.map(state => (
                          <TouchableOpacity
                            key={state.code}
                            style={styles.dropdownItem}
                            onPress={() => {
                              setForm(prev => ({...prev, state: state.name}));
                              setStateMenuVisible(false);
                            }}>
                            <Text>{state.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.primaryFormContainer}
                    onPress={() =>
                      setForm(prev => ({...prev, isPrimary: !form.isPrimary}))
                    }>
                    <Text>Is Primary Address</Text>
                    <Checkbox
                      status={form.isPrimary ? 'checked' : 'unchecked'}
                    />
                  </TouchableOpacity>
                  <View style={styles.types}>
                    <Text>Address Type: </Text>
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
        {/* <CustomDialog
          visible={true}
          title="Delete Address"
          message="Are you sure you want to delete this address?"
          primaryLabel="Delete"
          primaryAction={() => {
            setShowLoginDialog(false);
            if (selectedAddressId) {
              removeAddress({id: selectedAddressId});
            }
          }}
          secondaryLabel="Cancel"
          secondaryAction={() => setShowLoginDialog(false)}
          onDismiss={() => setShowLoginDialog(false)}
        /> */}

        {showLoginDialog && (
          <View style={styles.confirmDialogOverlay}>
            <View style={styles.confirmDialog}>
              <Text style={styles.confirmTitle}>Delete Address</Text>
              <Text style={styles.confirmMessage}>
                Are you sure you want to delete this address?
              </Text>
              <View style={styles.confirmActions}>
                <TouchableOpacity
                  style={styles.confirmCancel}
                  onPress={() => setShowLoginDialog(false)}>
                  <Text style={styles.cancelTxt}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmDelete}
                  onPress={() => {
                    setShowLoginDialog(false);
                    if (selectedAddressId) {
                      removeAddress({id: selectedAddressId});
                    }
                  }}>
                  <Text style={styles.deleteTxt}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </>
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
    maxHeight: '100%',
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    padding: 2,
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
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
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
  primaryBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  primaryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  primaryFormContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  confirmDialogOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmDialog: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    // alignItems: 'center',
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  confirmMessage: {
    fontSize: 16,
    marginBottom: 24,
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  confirmCancel: {
    marginRight: 16,
  },
  confirmDelete: {
    backgroundColor: '#FF3B30',
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  deleteTxt: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dropdownButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginVertical: 8,
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    position: 'absolute',
    right: 15,
    bottom: -30,
    // top: 'auto', // you may set `top: 0` with proper container layout
    zIndex: 999, // to bring it above modal content
    width: '100%',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
