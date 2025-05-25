import React, {useCallback, useState} from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
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
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {fetchCart} from '../../apis/fetchCart';
import {fetchProducts} from '../../apis/fetchProducts';
import {isArrayWithValues} from '../../utils/array/isArrayWithValues';
import {addCart} from '../../apis/addCart';
import {useNavigation} from '@react-navigation/native';
import CustomLoader from '../../components/Loaders/CustomLoader';
import {calculateDiscount} from '../../utils/discount/calculateDiscount';
import {getDiscountBasedOnRole} from '../../utils/products/getDiscountBasedOnRole';
import OrderForSelection from '../../components/OrderForSelection/OrderForSelection';
import {showSnackbar} from '../../redux/slice/snackbarSlice';

function formatAddress(address) {
  if (!address) return '';
  // Only include non-empty fields
  const parts = [
    address.address,
    address.city,
    address.state,
    address.pincode,
  ].filter(Boolean);
  return parts.join(', ');
}

const CartScreen = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const reduxUser = useAppSelector(state => state.auth.user);
  const reduxUserId = reduxUser?.id;
  const reduxUserRole = reduxUser?.role || 'user';

  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [discountCoupon, setDiscountCoupon] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const {data: addresses, isLoading: isAddressLoading} = useQuery({
    queryKey: ['user_addresses'],
    queryFn: async () => {
      const apiResponse = await getAddresses({id: reduxUserId});

      const data = apiResponse?.response?.data;
      setCurrentAddress(data?.[0] || null);
      return data || [];
    },
  });

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

const handleQuantityChange = async (product: string, change: number, setIsLoading) => {
  const productId = product?._id;

  const updatedItem = cartProductsItems?.find(
    item => item.product._id === productId,
  );

  if (updatedItem) {
    try {
      await updateCart({
        user_id: reduxUserId,
        product_id: productId,
        quantity: change,
      });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  }

  setIsLoading(false);
};


  const handlePlaceOrder = async ({
    orderId,
    addressId,
    cartId,
    couponId,
    selectedUser: currentSelectedUser,
  }) => {
    const payload = {
      cartId: cartId,
      addressId: addressId,
      couponId: couponId || null,
      orderId: orderId,
      ...(reduxUserRole === 'salesperson' || reduxUserRole === 'dnd'
        ? {orderedBy: reduxUserId, orderedForUser: currentSelectedUser}
        : {}),
    };

    if (!payload?.cartId || !payload.addressId || !payload.orderId) {
      dispatch(
        showSnackbar({
          type: 'error',
          title:
            'Please select a valid address and cart before placing an order.',
          placement: 'top',
        }),
      );

      return;
    }

    if (reduxUserRole === 'salesperson' || reduxUserRole === 'dnd') {
      if (!currentSelectedUser) {
        dispatch(
          showSnackbar({
            type: 'error',
            title: 'Please select a user.',
            placement: 'top',
          }),
        );
        return;
      }
    }
    // placeOrderMutation(payload);
  };

  const handleApplyCoupon = coupon => {
    setDiscountCoupon(coupon);
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
  const deliverTo = formatAddress(primaryAddress);

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

  const onValidatePlaceOrder = () => {
    if (!currentAddress) {
      dispatch(
        showSnackbar({
          type: 'error',
          title: 'Please select a delivery address.',
          placement: 'top',
        }),
      );
      return false;
    }

    if (
      (reduxUserRole === 'salesperson' || reduxUserRole === 'dnd') &&
      !selectedUser
    ) {
      dispatch(
        showSnackbar({
          type: 'error',
          title: 'Please select a user.',
          placement: 'top',
        }),
      );
      return false;
    }

    return true;
  };

  const discountedPrice = cartProductsItems.reduce((sum, item) => {
    const discountPrice = getDiscountBasedOnRole({
      role: reduxUserRole,
      discounted_price: item.product.discounted_price,
      original_price: item.product.price,
      salesperson_discounted_price: item.product.salesperson_discounted_price,
      dnd_discounted_price: item.product.dnd_discounted_price,
    });

    return sum + discountPrice * item.quantity;
  }, 0);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const discountedPriceAfterSubstracting = totalPrice - discountedPrice;
  const couponDiscoountPrice = discountCoupon
    ? calculateDiscount(cartData?.total_price, discountCoupon)
    : 0;

  const finalPrice = cartData?.total_price - couponDiscoountPrice;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <CartHeader
            isAddressPresent
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

          {isArrayWithValues(cartProductsItems) && (
            <OrderForSelection
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
          )}

          {/* Payable Amount & Order Button */}
          {isArrayWithValues(cartProductsItems) && (
            <CartPayableSection
              totalAmount={finalPrice}
              onPlaceOrder={handlePlaceOrder}
              onValidatePlaceOrder={onValidatePlaceOrder}
              addressId={currentAddress?._id}
              cartId={cartData?._id}
              couponId={discountCoupon?._id}
              selectedUser={selectedUser}
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
