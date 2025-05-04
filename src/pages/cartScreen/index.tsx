import React, {useState} from 'react';
import {Alert, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import CartHeader from '../../components/CartHeader';
import CartItem from '../../components/CartItem';
import CartBillSummary from '../../components/CartBillSummary';
import CartPayableSection from '../../components/CartPayableSection';
import CartOfferSection from '../../components/CartOfferSection';
import EmptyCart from '../../components/EmptyCart';
import ProductGrid from '../../components/ProductGrid';
import AddressDialog, {Address} from './components/AddressDialog';
import {getAddresses} from '../../apis/getAddresses';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useAppSelector} from '../../redux/store';
import {fetchCart} from '../../apis/fetchCart';
import {fetchProducts} from '../../apis/fetchProducts';
import {isArrayWithValues} from '../../utils/array/isArrayWithValues';
import {addCart} from '../../apis/addCart';
import {useNavigation} from '@react-navigation/native';
import CustomLoader from '../../components/Loaders/CustomLoader';
import {placeOrder} from '../../apis/placeOrder';
import {calculateDiscount} from '../../utils/discount/calculateDiscount';

const CartScreen = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const reduxUser = useAppSelector(state => state.auth.user);
  const reduxUserId = reduxUser?.id;

  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [discountCoupon, setDiscountCoupon] = useState(null);

  const {data: addresses, isLoading: isAddressLoading} = useQuery({
    queryKey: ['user_addresses'],
    queryFn: async () => {
      const apiResponse = await getAddresses({id: reduxUserId});

      const data = apiResponse?.response?.data;
      console.log('apiResponse >>>>', apiResponse, data);
      setCurrentAddress(data?.[0] || null);
      return data || [];
    },
  });
  console.log(addresses, 'addresses');

  const params = {
    user_id: reduxUserId,
  };

  const {data: cartData, isLoading: isCartDataLoading} = useQuery({
    queryKey: ['cart_products'],
    queryFn: () => fetchCart({params}),
  });

  const cartProductsItems = cartData?.items || [];

  const {mutate: updateCart, isPending: isUpdatingCart} = useMutation({
    mutationFn: updatedCart =>
      addCart({
        payload: updatedCart,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['cart_products']});
    },
  });

  const {mutate: placeOrderMutation, isPending: isPlacingOrder} = useMutation({
    mutationFn: payload => placeOrder({payload}),
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

  const handleQuantityChange = (product: string, change: number) => {
    const productId = product?._id;

    const updatedItem = cartProductsItems?.find(
      item => item.product._id === productId,
    );

    if (updatedItem) {
      updateCart({
        user_id: reduxUserId,
        product_id: productId,
        quantity: change,
      });
    }
  };

  const handlePlaceOrder = () => {
    const payload = {
      cartId: cartData?._id,
      addressId: currentAddress?._id,
      couponId: discountCoupon?.[0]?._id || null,
    };
    console.log('CALLED 111', payload);

    if (!payload?.cartId || !payload.addressId) {
      Alert.alert(
        'Error',
        'Please select a valid address and cart before placing an order.',
      );
      return;
    }

    console.log('CALLED', payload);
    placeOrderMutation(payload);
  };

  const handleApplyCoupon = coupon => {
    setDiscountCoupon(coupon);
    console.log('Apply coupon pressed');
  };

  const onOpenAddressDialog = () => {
    setDialogVisible(true);
  };

  const handleChangeAddress = address => {
    setCurrentAddress(address);
    setDialogVisible(false);
  };

  const handleShopNow = () => {
    navigation.navigate('HomeTab');
  };

  const primaryAddress = currentAddress;
  const deliverTo = `${primaryAddress?.name || ''}, ${
    primaryAddress?.address || ''
  }, ${primaryAddress?.city || ''}, ${primaryAddress?.state || ''}, ${
    primaryAddress?.pincode
  }`;

  const lastMinuteBuyProductsParams = {
    is_best_seller: true,
    page: 1,
    per_page: 10,
  };

  const {
    data: lastMinuteBuyProducts,
    isLoading: isLastMinuteBuyProductsLoading,
  } = useQuery({
    queryKey: ['top_ordered_products'],
    queryFn: async () => {
      const apiResponse = await fetchProducts({
        params: lastMinuteBuyProductsParams,
      });
      if (apiResponse?.response?.success) {
        return apiResponse?.response?.data?.data;
      }
      return [];
    },
  });

  const alternativeProductsParams = {
    is_best_seller: true,
    page: 1,
    per_page: 10,
  };

  const {data: alternativeProducts, isLoading: isAlternativeProductsLoading} =
    useQuery({
      queryKey: ['top_ordered_products'],
      queryFn: async () => {
        const apiResponse = await fetchProducts({
          params: alternativeProductsParams,
        });
        if (apiResponse?.response?.success) {
          return apiResponse?.response?.data?.data;
        }
        return [];
      },
    });

  const totalPrice = cartProductsItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const discountedPrice = cartProductsItems.reduce(
    (sum, item) => sum + item.product.discounted_price * item.quantity,
    0,
  );

  const discountedPriceAfterSubstracting = totalPrice - discountedPrice;
  const couponDiscoountPrice = discountCoupon
    ? calculateDiscount(cartData?.total_price, discountCoupon)
    : 0;

  const finalPrice = cartData?.total_price - couponDiscoountPrice;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <CartHeader
            deliverTo={deliverTo || ''}
            onChangePress={onOpenAddressDialog}
            isAddressLoading={isAddressLoading}
          />

          {/* Cart Items */}
          {isCartDataLoading ? (
            <CustomLoader height={400} />
          ) : isArrayWithValues(cartProductsItems) ? (
            cartProductsItems.map(item => (
              <CartItem
                key={item.id}
                item={item?.product}
                productQuantity={item?.quantity}
                onRemove={() => handleQuantityChange(item?.product, 0)}
                onQuantityChange={handleQuantityChange}
              />
            ))
          ) : (
            <EmptyCart onShopNow={handleShopNow} />
          )}

          {/* Bill Summary */}
          {isArrayWithValues(cartProductsItems) && (
            <CartBillSummary
              itemTotal={totalPrice || 0}
              platformFee={0}
              discount={discountedPriceAfterSubstracting}
              shippingFee={0}
              couponDiscount={couponDiscoountPrice}
              totalAmount={finalPrice}
            />
          )}

          {isArrayWithValues(cartProductsItems) && (
            <CartOfferSection
              onApplyCoupon={handleApplyCoupon}
              discountCoupon={discountCoupon}
              onRemoveCoupon={() => setDiscountCoupon(null)}
            />
          )}

          {/* Payable Amount & Order Button */}
          {isArrayWithValues(cartProductsItems) && (
            <CartPayableSection
              totalAmount={finalPrice}
              onPlaceOrder={handlePlaceOrder}
            />
          )}

          {/* Offers & Coupons */}

          <ProductGrid title="Last Minute Buys" data={lastMinuteBuyProducts} />

          <ProductGrid
            title="Alternative products"
            data={alternativeProducts}
          />
        </ScrollView>
      </SafeAreaView>

      <AddressDialog
        visible={dialogVisible}
        addresses={addresses}
        onClose={() => setDialogVisible(false)}
        onSelect={handleChangeAddress}
        currentAddress={currentAddress}
      />
    </>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
