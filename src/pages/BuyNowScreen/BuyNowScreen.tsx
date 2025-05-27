import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {getAddresses} from '../../apis/getAddresses';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {showSnackbar} from '../../redux/slice/snackbarSlice';
import CustomDialog from '../../components/CustomDialog/CustomDialog';
import {apiService} from '../../utils/api/apiService';
import {endpoints} from '../../utils/endpoints';
import {
  CFErrorResponse,
  CFPaymentGatewayService,
} from 'react-native-cashfree-pg-sdk';
import {
  CFDropCheckoutPayment,
  CFEnvironment,
  CFPaymentComponentBuilder,
  CFPaymentModes,
  CFSession,
  CFThemeBuilder,
} from 'cashfree-pg-api-contract';
import {getDiscountBasedOnRole} from '../../utils/products/getDiscountBasedOnRole';
import {getTaxAmount} from '../../apis/getTaxAmount';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {buyNowOrder} from '../../apis/buyNowOrder';
import OrderForSelection from '../../components/OrderForSelection/OrderForSelection';
import {Picker} from '@react-native-picker/picker';
import {isArrayWithValues} from '../../utils/array/isArrayWithValues';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BuyNowScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useAppDispatch();

  const reduxUser = useAppSelector(state => state.auth.user);
  const reduxUserId = reduxUser?.id;
  const reduxUserRole = reduxUser?.role || 'user';

  const [currentAddress, setCurrentAddress] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [price, setPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const {product} = route.params || {};
  const productId = product?._id || '';

  useEffect(() => {
    const newPrice = product?.price || 0;
    const newDiscountedPrice = getDiscountBasedOnRole({
      role: reduxUserRole,
      discounted_price: product?.discounted_price || 0,
      salesperson_discounted_price: product?.salesperson_discounted_price || 0,
      dnd_discounted_price: product?.dnd_discounted_price || 0,
      original_price: product?.price || 0,
    });
    setPrice(newPrice);
    setDiscountedPrice(newDiscountedPrice);

    if (currentAddress) {
      const address = addresses?.find(it => it._id === currentAddress);
      const tax = Number(
        getTaxAmount(
          [
            {
              product,
              quantity,
            },
          ],
          0,
          address,
          reduxUserRole,
        ),
      );

      setTaxAmount(tax);
      setTotalPayable(Number(newDiscountedPrice * quantity) + tax);
    } else {
      setTaxAmount(0);
      setTotalPayable(0);
    }
  }, [product, quantity, currentAddress, reduxUserRole]);

  // Fetch addresses
  const fetchAddresses = useCallback(async () => {
    const apiResponse = await getAddresses({id: reduxUserId});
    const data = apiResponse?.response?.data;
    if (data?.length > 0) {
      setCurrentAddress(data[0]);
    }
    return data || [];
  }, [reduxUserId]);

  const {data: addresses, isLoading: isAddressLoading} = useQuery({
    queryKey: ['user_addresses'],
    queryFn: fetchAddresses,
  });

  const onGoBack = () => {
    navigation.goBack();
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const onRedirectToPayment = async () => {
    if (!currentAddress) {
      dispatch(
        showSnackbar({
          type: 'error',
          title: 'Please select a delivery address',
          placement: 'top',
        }),
      );
      return;
    }

    if (selectedUser) {
      await AsyncStorage.setItem('selectedUserId', selectedUser);
    }

    if (currentAddress) {
      await AsyncStorage.setItem('selectedAddressId', currentAddress?._id);
    }

    try {
      const apiResponse = await apiService({
        endpoint: endpoints.payment,
        method: 'POST',
        data: {
          amount: Number(totalPayable),
          customerId: reduxUserId,
          customerEmail: reduxUser?.email || 'test@gmail.com',
          customerPhone: reduxUser?.mobile || '98765431237',
        },
      });

      const sessionId = apiResponse?.response?.data?.payment_session_id;
      const orderId = apiResponse?.response?.data?.order_id;

      if (!sessionId || !orderId) {
        dispatch(
          showSnackbar({
            type: 'error',
            title: 'Invalid session or order information',
            placement: 'top',
          }),
        );
        return;
      }
      const session = new CFSession(sessionId, orderId, CFEnvironment.SANDBOX);

      const paymentModes = new CFPaymentComponentBuilder()
        .add(CFPaymentModes.CARD)
        .add(CFPaymentModes.UPI)
        .add(CFPaymentModes.NB)
        .add(CFPaymentModes.WALLET)
        .add(CFPaymentModes.PAY_LATER)
        .build();
      const theme = new CFThemeBuilder()
        .setNavigationBarBackgroundColor('#E64A19')
        .setNavigationBarTextColor('#FFFFFF')
        .setButtonBackgroundColor('#FFC107')
        .setButtonTextColor('#FFFFFF')
        .setPrimaryTextColor('#212121')
        .setSecondaryTextColor('#757575')
        .build();
      const dropPayment = new CFDropCheckoutPayment(
        session,
        paymentModes,
        theme,
      );
      CFPaymentGatewayService.doPayment(dropPayment);
    } catch (error: any) {
      dispatch(
        showSnackbar({
          type: 'error',
          title: 'Payment initiation failed.',
          placement: 'top',
        }),
      );
    }
  };

  const handlePlaceOrder = async (orderId: string | number) => {
    if (isPlacingOrder) {
      return;
    }

    try {
      setIsPlacingOrder(true);

      const storedUser = await AsyncStorage.getItem('selectedUserId');
      const storedAddress = await AsyncStorage.getItem('selectedAddressId');

      console.log('Stored User:', storedUser);
      console.log('Stored Address:', storedAddress);

      const payload = {
        orderId,
        ...(reduxUserRole !== 'salesperson' && reduxUserRole !== 'dnd'
          ? {addressId: storedAddress}
          : {}),
        productId,
        quantity: quantity,
        ...(reduxUserRole === 'salesperson' || reduxUserRole === 'dnd'
          ? {orderedBy: reduxUserId, orderedForUser: storedUser}
          : {}),
      };

      const apiResponse = await buyNowOrder({payload});

      if (apiResponse?.response?.success) {
        setShowDialog(true);
      } else {
        const error = apiResponse?.response?.data?.message;
        dispatch(
          showSnackbar({
            type: 'error',
            title:
              error || 'Failed to place the order. Please try again later.',
            placement: 'top',
          }),
        );
      }
    } catch (error) {
      console.error('Error placing order:', error);
      dispatch(
        showSnackbar({
          type: 'error',
          title: 'Failed to place the order. Please try again later.',
          placement: 'top',
        }),
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  useEffect(() => {
    CFPaymentGatewayService.setCallback({
      onVerify(orderID: string): void {
        handlePlaceOrder(orderID, currentAddress, quantity);
      },
      onError(error: CFErrorResponse, orderID: string): void {
        console.log('Payment Error:', error, orderID);
        dispatch(
          showSnackbar({
            type: 'error',
            title: 'Payment failed. Please try again.',
            placement: 'top',
          }),
        );
      },
    });
  }, []);

  const onNavigateToOrder = () => {
    setShowDialog(false);
    navigation.navigate('ViewOrderScreen');
  };

  const getAddressText = address => {
    if (!address) return 'Select an address';
    return [
      address.name,
      address.address,
      address.city,
      address.state,
      address.pincode,
    ]
      .filter(Boolean)
      .join(', ');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#00008B" />
        </TouchableOpacity>
        <Text style={styles.title}>Buy Now</Text>
      </View>

      {/* Product Card */}
      <View style={styles.productCard}>
        <Image
          source={{uri: product?.banner_image || product?.images?.[0]}}
          style={styles.productImage}
        />
        <View style={{flex: 1, marginLeft: 12}}>
          <Text style={styles.productName} numberOfLines={2}>
            {product?.name}
          </Text>
          <Text style={styles.productDesc} numberOfLines={2}>
            {product?.small_description}
          </Text>
        </View>
      </View>

      {/* Quantity Selector */}
      <View style={styles.quantityContainer}>
        <Text style={styles.label}>Quantity</Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={decreaseQuantity}
            disabled={quantity <= 1}>
            <Icon
              name="remove"
              size={20}
              color={quantity <= 1 ? '#ccc' : '#00008B'}
            />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={increaseQuantity}>
            <Icon name="add" size={20} color="#00008B" />
          </TouchableOpacity>
        </View>
      </View>

      <OrderForSelection
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        removeBackground={true}
      />

      {/* Address Selection */}
      {/* <Text style={styles.label}>Select Delivery Address</Text>
      {isAddressLoading ? (
        <ActivityIndicator size="small" color="#00008B" />
      ) : (
        <View style={styles.dropdownContainer}>
          <Menu
            visible={showDropdown}
            onDismiss={() => setShowDropdown(false)}
            anchor={
              <TouchableOpacity
                style={styles.dropdownTrigger}
                onPress={() => setShowDropdown(true)}>
                <Text style={styles.dropdownText}>
                  {getAddressText(currentAddress)}
                </Text>
                <Icon
                  name={showDropdown ? 'arrow-drop-up' : 'arrow-drop-down'}
                  size={24}
                  color="#00008B"
                />
              </TouchableOpacity>
            }
            contentStyle={styles.dropdownContent}>
            <ScrollView style={{maxHeight: 200}}>
              {Array.isArray(addresses) && addresses.length > 0 ? (
                addresses.map(address => (
                  <Menu.Item
                    key={address._id}
                    title={getAddressText(address)}
                    onPress={() => {
                      setCurrentAddress(address);
                      setShowDropdown(false);
                    }}
                    style={styles.dropdownItem}
                  />
                ))
              ) : (
                <Menu.Item
                  title="No addresses found. Please add an address in your profile."
                  onPress={() => setShowDropdown(false)}
                  style={styles.dropdownItem}
                />
              )}
            </ScrollView>
          </Menu>
        </View>
      )} */}

      {reduxUserRole === 'user' && (
        <>
          <Text style={styles.label}>Select Delivery Address</Text>
          <View style={styles.pickerContainer}>
            {isAddressLoading ? (
              <ActivityIndicator size="small" color="#00008B" />
            ) : (
              <Picker
                selectedValue={currentAddress}
                onValueChange={itemValue => setCurrentAddress(itemValue)}
                style={styles.picker}>
                {isArrayWithValues(addresses) ? (
                  addresses?.map((address: any) => (
                    <Picker.Item
                      key={address}
                      label={getAddressText(address)}
                      value={address?._id}
                      color={
                        currentAddress === address?._id ? '#00008B' : '#222'
                      }
                      style={[
                        styles.pickerItem,
                        currentAddress === address?._id &&
                          styles.selectedPickerItem,
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

      {/* Price Details */}
      {currentAddress && (
        <View style={styles.priceDetails}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>MRP (x{quantity})</Text>
            <Text style={styles.priceValue}>
              ₹{(price * quantity).toFixed(2)}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Your Price (x{quantity})</Text>
            <Text style={styles.priceValue}>
              ₹{(discountedPrice * quantity).toFixed(2)}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tax</Text>
            <Text style={styles.priceValue}>₹{taxAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabelTotal}>Total Payable</Text>
            <Text style={styles.priceValueTotal}>
              ₹{totalPayable.toFixed(2)}
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.placeOrderButton,
          !currentAddress && {backgroundColor: '#ccc'},
        ]}
        onPress={onRedirectToPayment}
        disabled={!currentAddress || isPlacingOrder}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {isPlacingOrder && (
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{marginRight: 8}}
            />
          )}
          <Text style={styles.placeOrderText}>
            {isPlacingOrder ? 'Placing order...' : 'Pay & Place Order'}
          </Text>
        </View>
      </TouchableOpacity>
      
      <CustomDialog
        visible={showDialog}
        title="Order placed"
        message="Your order has been placed successfully."
        primaryLabel="Go to orders"
        primaryAction={onNavigateToOrder}
        secondaryLabel="Cancel"
        secondaryAction={() => {
          setShowDialog(false);
          navigation.navigate('Home');
        }}
        onDismiss={() => {
          setShowDialog(false);
          navigation.navigate('Home');
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00008B',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#e3e6ee',
  },
  productName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 13,
    color: '#666',
  },
  priceDetails: {
    backgroundColor: '#f2f8fd',
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  priceLabel: {
    fontSize: 15,
    color: '#222',
  },
  priceValue: {
    fontSize: 15,
    color: '#222',
  },
  priceLabelTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00008B',
  },
  priceValueTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00008B',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#222',
    marginTop: 10,
  },
  dropdownContainer: {
    marginBottom: 24,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderWidth: 1,
    borderColor: '#82C8E5',
    borderRadius: 8,
    backgroundColor: '#F7F7F7',
  },
  dropdownText: {
    fontSize: 15,
    color: '#222',
    flex: 1,
  },
  dropdownContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  dropdownItem: {
    padding: 12,
    width: '100%',
  },
  placeOrderButton: {
    backgroundColor: '#00008B',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#82C8E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
    color: '#00008B',
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

export default BuyNowScreen;
