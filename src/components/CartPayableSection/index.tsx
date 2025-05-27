import {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
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
import {useQueryClient} from '@tanstack/react-query';
import {placeOrder} from '../../apis/placeOrder';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {showSnackbar} from '../../redux/slice/snackbarSlice';
import CustomDialog from '../CustomDialog/CustomDialog';

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
      totalAmount={totalAmount}
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
  totalAmount: number;
};

export const Checkout = ({
  onValidatePlaceOrder,
  addressId,
  cartId,
  couponId,
  selectedUser,
  totalAmount,
}: CheckoutType) => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const reduxUser = useAppSelector(state => state.auth.user);
  const reduxUserRole = reduxUser?.role || 'user';

  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const onRedirectToPayment = async () => {
    if (!addressId) {
      dispatch(
        showSnackbar({
          type: 'error',
          title: 'Please select a delivery address',
          placement: 'top',
        }),
      );
      return;
    }

    if (
      (reduxUserRole === 'salesperson' || reduxUserRole === 'dnd') &&
      !selectedUser
    ) {
      dispatch(
        showSnackbar({
          type: 'error',
          title: 'Please select a user',
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
          amount: totalAmount,
          customerId: '123456789',
          customerEmail: 'test@gmail.com',
          customerPhone: '98765431237',
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
    }
  };

  const onNavigateToHome = () => {
    navigation.navigate('HomeTab');
  };

  const handlePlaceOrder = async (orderId: string | number) => {
    const payload = {
      orderId,
      addressId,
      cartId,
      couponId,
      selectedUser,
    };

    const apiResponse = await placeOrder({payload});

    if (apiResponse?.response?.success) {
      setShowLoginDialog(true);

      queryClient.invalidateQueries({queryKey: ['cart_products']});
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

  return (
    <>
      <TouchableOpacity
        style={styles.placeOrderButton}
        onPress={onRedirectToPayment}>
        <Text style={styles.placeOrderText}>Place Order</Text>
      </TouchableOpacity>

      <CustomDialog
        visible={showLoginDialog}
        title="Order placed"
        message="Your order has been placed successfully. "
        primaryLabel="Go to Home"
        primaryAction={() => {
          setShowLoginDialog(false);
          onNavigateToHome();
        }}
        secondaryLabel="Cancel"
        secondaryAction={() => setShowLoginDialog(false)}
        onDismiss={() => setShowLoginDialog(false)}
      />
    </>
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
