import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {addAddress} from '../../apis/addAddress';
import AddressDialog, {
  Address,
} from '../../pages/cartScreen/components/AddressDialog';
import {formatAddress} from '../../utils/format_address';
import {getAddresses} from '../../apis/getAddresses';
import {useAppSelector} from '../../redux/store';
import {Chip} from 'react-native-paper';

const AddressManager = () => {
  const [openAddress, setOpenAddress] = useState(false);
  const [address, setAddressState] = useState({});
  const user = useAppSelector(state => state.auth.user);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);

  const {data: addresses} = useQuery({
    queryKey: ['user_addresses'],
    queryFn: () => getAddresses({id: user?.id}),
    select: data => data?.response?.data,
  });

  const onOpenAddressDialog = () => {
    setDialogVisible(true);
  };

  const handleChangeAddress = address => {
    setCurrentAddress(address);
    setDialogVisible(false);
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      const userId = getItem('userId');
      await addAddress({id: userId});
    };
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isPrimary === true);
      if (defaultAddress) {
        setAddressState(defaultAddress);
      } else {
        setAddressState({});
      }
    } else {
      setAddressState({});
    }
  }, [addresses]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Delivering to</Text>
        <TouchableOpacity onPress={onOpenAddressDialog}>
          <Text style={styles.changeText}>
            {Array.isArray(addresses) && addresses.length > 0
              ? 'Change Address'
              : 'Add Address'}
          </Text>
        </TouchableOpacity>
      </View>

      {address && Object.values(address).some(val => val) && (
        <View style={styles.addressBox}>
          <View style={{position: 'absolute', top: 5, right: 10}}>
            <Chip
              style={{
                backgroundColor: '#007AFF',
                padding: 0,
              }}
              textStyle={{
                color: '#fff',
                fontSize: 12,
                fontWeight: '600',
              }}>
              Primary
            </Chip>
          </View>
          <Text style={styles.addressName}>
            {address.name}, {address?.pincode}
          </Text>
          <Text style={styles.addressDetail}>
            Address - {formatAddress(address)}
          </Text>
        </View>
      )}

      <AddressDialog
        visible={dialogVisible}
        addresses={addresses}
        onClose={() => setDialogVisible(false)}
        onSelect={handleChangeAddress}
        currentAddress={currentAddress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    // borderTopWidth: 1,
    // borderTopColor: "#333",
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  changeText: {
    color: '#C62828',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  addressBox: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  addressName: {
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
  },
  addressDetail: {
    color: '#444',
  },
});

export default AddressManager;
