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

type CartPayableSectionProps = {
  totalAmount: number;
  onPlaceOrder: (orderId: string | number) => void;
};

const CartPayableSection = ({
  totalAmount,
  onPlaceOrder,
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
    <Checkout onPlaceOrder={onPlaceOrder} />
  </View>
);

export default CartPayableSection;

type CheckoutType = {
  onPlaceOrder: (orderId: string | number) => void;
};

export const Checkout = ({onPlaceOrder}: CheckoutType) => {
  const navigation = useNavigation();

  const onRedirectToPayment = async () => {
    try {
      const apiResponse = await apiService({
        endpoint: endpoints.payment,
        method: 'POST',
        data: {
          // addressId: addressId,
          // cartId: cartId,
          // couponId: couponId,
          amount: 1000,
          customerId: '123456789',
          customerEmail: 'test@gmail.com',
          customerPhone: '98765431237',
        },
      });
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
        onPlaceOrder(orderID);
        console.log('Payment Success, OrderID:', orderID);
        Alert.alert('Payment Success', `Order ID: ${orderID}`);
        navigation.navigate('Account', {
          screen: 'ViewOrderScreen',
        });
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
