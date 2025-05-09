import {useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
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
import {useNavigation} from '@react-navigation/native';
import {apiService} from '../../utils/api/apiService';
import {endpoints} from '../../utils/endpoints';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {placeOrder} from '../../apis/placeOrder';

type CartPayableSectionProps = {
  totalAmount: number;
  onPlaceOrder: ({
    orderId,
    addressId,
    cartId,
    couponId,
    selectedUser,
  }: PlaceOrderType) => void;
  onValidatePlaceOrder: () => boolean;
  addressId: string | number;
  cartId: string | number;
  couponId: string | number;
  selectedUser: string | null;
};

const CartPayableSection = ({
  totalAmount,
  onPlaceOrder,
  onValidatePlaceOrder,
  addressId,
  cartId,
  couponId,
  selectedUser,
}: CartPayableSectionProps) => (
  <View style={styles.payableContainer}>
    <View>
      <Text style={styles.payableLabel}>Payable Amount</Text>
      <View style={styles.payableRow}>
        <Text style={styles.payableAmount}>₹{totalAmount}</Text>
        {/* <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Icon name="information-outline" size={18} color="#4D4D4D" />
        </View> */}
      </View>
    </View>
    <Checkout
      onPlaceOrder={onPlaceOrder}
      onValidatePlaceOrder={onValidatePlaceOrder}
      addressId={addressId}
      cartId={cartId}
      couponId={couponId}
      selectedUser={selectedUser}
    />
  </View>
);

export default CartPayableSection;

type PlaceOrderType = {
  orderId: string | number;
  addressId: string | number;
  cartId: string | number;
  couponId: string | number;
  selectedUser: string | null;
};

type CheckoutType = {
  onPlaceOrder: ({
    orderId,
    addressId,
    cartId,
    couponId,
    selectedUser,
  }: PlaceOrderType) => void;
  onValidatePlaceOrder: () => boolean;
  addressId: string | number;
  cartId: string | number;
  couponId: string | number;
  selectedUser: string | null;
};

export const Checkout = ({
  onPlaceOrder,
  onValidatePlaceOrder,
  addressId,
  cartId,
  couponId,
  selectedUser,
}: CheckoutType) => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const {mutate: placeOrderMutation, isPending: isPlacingOrder} = useMutation({
    mutationFn: async payload => placeOrder({payload}),
    onSuccess: data => {
      if (data?.response?.success) {
        Alert.alert(
          'Order Placed',
          'Your order has been placed successfully!',
          [
            {
              text: 'Go to Home Page',
              onPress: () => {
                navigation.navigate('HomeTab');
              },
            },
            {
              text: 'Cancel',
              onPress: () => {},
            },
          ],
        );
        queryClient.invalidateQueries({queryKey: ['cart_products']});
      }
    },
    onError: error => {
      console.error('Error placing order:', error);
      Alert.alert(
        'Error',
        'Failed to place the order. Please try again later.',
      );
    },
  });

  console.log(
    'Payment Gateway Service Initialized',
    addressId,
    cartId,
    couponId,
    selectedUser,
  );

  const onRedirectToPayment = async () => {
    const isValid = onValidatePlaceOrder();

    if (!isValid) {
      return;
    }
    try {
      const apiResponse = await apiService({
        endpoint: endpoints.payment,
        method: 'POST',
        data: {
          amount: 1000,
          customerId: '123456789',
          customerEmail: 'test@gmail.com',
          customerPhone: '98765431237',
        },
      });
      console.log('Payment API Response:', apiResponse);
      const sessionId = apiResponse?.response?.data?.payment_session_id;
      const orderId = apiResponse?.response?.data?.order_id;

      if (!sessionId || !orderId) {
        Alert.alert('Payment Error', 'Invalid session or order information.');
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
    }
  };

  useEffect(() => {
    CFPaymentGatewayService.setCallback({
      onVerify(orderID: string): void {
        placeOrderMutation({
          orderId: orderID,
          addressId,
          cartId,
          couponId,
          selectedUser,
        });

        console.log('Payment Success, OrderID:', orderID);
      },
      onError(error: CFErrorResponse, orderID: string): void {
        console.log('Payment Error:', error, orderID);
        Alert.alert(
          'Payment Failed',
          `Error: ${JSON.stringify(error)}\nOrder ID: ${orderID}`,
        );
      },
    });
  }, []);

  return (
    <TouchableOpacity
      style={styles.placeOrderButton}
      onPress={onRedirectToPayment}>
      <Text style={styles.placeOrderText}>Place Order</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  payableContainer: {
    backgroundColor: '#82C8E51A',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 1,
    marginBottom: 8,
  },
  payableLabel: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  payableRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payableAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 6,
    color: '#297C00',
  },
  placeOrderButton: {
    backgroundColor: '#00008B',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 25,
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
