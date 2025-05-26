import React, {useEffect, useState} from 'react';
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
import {placeOrder} from '../../apis/placeOrder';
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

const BuyNowScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useAppDispatch();

  const reduxUser = useAppSelector(state => state.auth.user);
  const reduxUserId = reduxUser?.id;
  const reduxUserRole = reduxUser?.role || 'user';

  const [currentAddress, setCurrentAddress] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const {product} = route.params || {};
  const productId = product?._id || '';

  // Pricing logic
  const price = product?.price || 0;
  const discountedPrice = getDiscountBasedOnRole({
    role: reduxUserRole,
    discounted_price: product?.discounted_price || 0,
    salesperson_discounted_price: product?.salesperson_discounted_price || 0,
    dnd_discounted_price: product?.dnd_discounted_price || 0,
    original_price: product?.price || 0,
  });

  // Tax and total only after address is selected
  const taxAmount = currentAddress
    ? getTaxAmount(
        [
          {
            product,
            quantity: 1,
          },
        ],
        0,
        currentAddress,
      )
    : 0;
  const totalPayable = currentAddress ? (Number(discountedPrice) + Number(taxAmount)).toFixed(2) : 0;
  console.log('ADDRESS', currentAddress, taxAmount);

  // Fetch addresses
  const {data: addresses, isLoading: isAddressLoading} = useQuery({
    queryKey: ['user_addresses'],
    queryFn: async () => {
      const apiResponse = await getAddresses({id: reduxUserId});
      const data = apiResponse?.response?.data;
      setCurrentAddress(data?.[0] || null);
      return data || [];
    },
  });

  // Payment and order logic
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

    try {
      const apiResponse = await apiService({
        endpoint: endpoints.payment,
        method: 'POST',
        data: {
          amount: totalPayable,
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
    } catch (e: any) {
      console.log(e);
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
    const payload = {
      orderId,
      addressId: currentAddress?._id,
      productId,
      quantity: 1,
    };

    const apiResponse = await placeOrder({payload});

    if (apiResponse?.response?.success) {
      setShowDialog(true);
    } else {
      const error = apiResponse?.response?.data?.message;
      dispatch(
        showSnackbar({
          type: 'error',
          title: error || 'Failed to place the order. Please try again later.',
          placement: 'top',
        }),
      );
    }
  };

  useEffect(() => {
    CFPaymentGatewayService.setCallback({
      onVerify(orderID: string): void {
        handlePlaceOrder(orderID);
      },
      onError(error: CFErrorResponse, orderID: string): void {
        dispatch(
          showSnackbar({
            type: 'error',
            title: 'Payment failed. Please try again.',
            placement: 'top',
          }),
        );
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAddress, productId]);

  const onNavigateToHome = () => {
    setShowDialog(false);
    navigation.navigate('HomeTab');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Buy Now</Text>

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

      {/* Address Selection */}
      <Text style={styles.label}>Select Delivery Address</Text>
      {isAddressLoading ? (
        <ActivityIndicator size="small" color="#00008B" />
      ) : (
        <View style={styles.dropdownContainer}>
          {Array.isArray(addresses) && addresses.length > 0 ? (
            addresses.map(address => (
              <TouchableOpacity
                key={address._id}
                style={[
                  styles.addressOption,
                  currentAddress?._id === address._id && styles.selectedAddress,
                ]}
                onPress={() => setCurrentAddress(address)}>
                <Text style={styles.addressText}>
                  {[
                    address.name,
                    address.address,
                    address.city,
                    address.state,
                    address.pincode,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noAddressText}>
              No addresses found. Please add an address in your profile.
            </Text>
          )}
        </View>
      )}

      {/* Price Details - only show after address is selected */}
      {currentAddress && (
        <View style={styles.priceDetails}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>MRP</Text>
            <Text style={styles.priceValue}>₹{price}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Your Price</Text>
            <Text style={styles.priceValue}>₹{discountedPrice}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tax</Text>
            <Text style={styles.priceValue}>₹{taxAmount}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabelTotal}>Total Payable</Text>
            <Text style={styles.priceValueTotal}>₹{totalPayable}</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.placeOrderButton,
          !currentAddress && {backgroundColor: '#ccc'},
        ]}
        onPress={onRedirectToPayment}
        disabled={!currentAddress}>
        <Text style={styles.placeOrderText}>Pay & Place Order</Text>
      </TouchableOpacity>

      <CustomDialog
        visible={showDialog}
        title="Order placed"
        message="Your order has been placed successfully."
        primaryLabel="Go to Home"
        primaryAction={onNavigateToHome}
        secondaryLabel="Cancel"
        secondaryAction={() => setShowDialog(false)}
        onDismiss={() => setShowDialog(false)}
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
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
  },
  dropdownContainer: {
    marginBottom: 24,
  },
  addressOption: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#82C8E5',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#F7F7F7',
  },
  selectedAddress: {
    borderColor: '#00008B',
    backgroundColor: '#E3E6EE',
  },
  addressText: {
    fontSize: 15,
    color: '#222',
  },
  noAddressText: {
    color: '#888',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  placeOrderButton: {
    backgroundColor: '#00008B',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default BuyNowScreen;
