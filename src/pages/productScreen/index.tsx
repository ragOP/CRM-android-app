import React from 'react';
import CustomSearch from '../../components/CustomSearch';
import ProductPage from '../../components/ProductPage';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {addCart} from '../../apis/addCart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchProducts} from '../../apis/fetchProducts';
import ProductGrid from '../../components/ProductGrid';
import ProductReviews from './components/ProductReviews';
import RefreshControlWrapper from '../../components/RefreshControlWrapper/RefreshControlWrapper';
import {showSnackbar} from '../../redux/slice/snackbarSlice';
import CustomDialog from '../../components/CustomDialog/CustomDialog';

const ProductScreen = () => {
  const route = useRoute();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const reduxToken = useAppSelector(state => state.auth.token);
  const reduxUser = useAppSelector(state => state.auth.user);

  const reduxUserId = reduxUser?.id;

  const [refreshing, setRefreshing] = React.useState(false);
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);

  const {product} = route.params || {};

  const {mutate: addToCartMutation, isPending} = useMutation({
    mutationFn: ({payload}) =>
      addCart({
        payload: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['cart_products']});
      dispatch(
        showSnackbar({
          type: 'success',
          title: 'Product added to cart!',
          placement: 'top',
        }),
      );
    },
    onError: () => {
      dispatch(
        showSnackbar({
          type: 'error',
          title: 'Failed to add product to cart. Please try again!',
          placement: 'top',
        }),
      );
    },
  });

  const onSaveProductLocallyAndLogin = async () => {
    try {
      const productData = {
        product_id: product?._id,
        quantity: 1,
      };

      // Save product data to AsyncStorage with a timestamp
      const dataToSave = {
        product: productData,
        timestamp: Date.now(),
      };

      await AsyncStorage.setItem('tempProduct', JSON.stringify(dataToSave));

      navigation.navigate('Account', {screen: 'LoginScreen'});
    } catch (error) {
      console.error('Error saving product locally:', error);
    }
  };

  const onAddToCart = () => {
    if (!reduxToken) {
      setShowLoginDialog(true);
      return;
    }

    const payload = {
      user_id: reduxUserId,
      product_id: product?._id,
      quantity: 1,
    };

    if (product?.type !== 'service' && product?.inventory <= 0) {
      dispatch(
        showSnackbar({
          type: 'error',
          title: 'Product is out of stock!',
          placement: 'top',
        }),
      );
      return;
    }

    addToCartMutation({payload});
  };

  const onBuyNow = () => {
    if (!reduxToken) {
      setShowLoginDialog(true);
      return;
    }

    const payload = {
      user_id: reduxUserId,
      product_id: product?._id,
      quantity: 1,
    };

    if (product?.type !== 'service' && product?.inventory <= 0) {
      dispatch(
        showSnackbar({
          type: 'error',
          title: 'Product is out of stock!',
          placement: 'top',
        }),
      );
      return;
    }

    navigation.navigate('BuyNowScreen', {product: product});
  };

  const alternativeProductsParams = {
    is_best_seller: true,
    page: 1,
    per_page: 10,
  };

  const {data: alternativeProducts, isLoading: isAlternativeProductsLoading} =
    useQuery({
      queryKey: ['alternative_products'],
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

  const bestBuyProductsParams = {
    is_best_seller: true,
    page: 1,
    per_page: 10,
  };

  const onRefresh = async () => {
    console.log('REFRESHED');

    setRefreshing(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    await queryClient.invalidateQueries({queryKey: ['alternative_products']});
    await queryClient.invalidateQueries({queryKey: ['best_buy_products']});
    await queryClient.invalidateQueries({queryKey: ['reviews']});

    setRefreshing(false);
  };

  const {data: bestBuyProducts, isLoading: isBestBuyProductsLoading} = useQuery(
    {
      queryKey: ['alternative_products'],
      queryFn: async () => {
        const apiResponse = await fetchProducts({
          params: bestBuyProductsParams,
        });
        if (apiResponse?.response?.success) {
          return apiResponse?.response?.data?.data;
        }
        return [];
      },
    },
  );

  return (
    <>
      <RefreshControlWrapper refreshing={refreshing} onRefresh={onRefresh}>
        <CustomSearch redirectToUniversalScreen={true} />
        <ProductPage
          product={product}
          onBuyNow={onBuyNow}
          onAddToCart={onAddToCart}
        />

        <ProductGrid
          title="Alternative Products"
          data={alternativeProducts}
          isLoading={isAlternativeProductsLoading}
        />

        <ProductGrid
          title="Best Buys"
          data={bestBuyProducts}
          isLoading={isBestBuyProductsLoading}
        />

        <ProductReviews productId={product?._id} />
      </RefreshControlWrapper>

      <CustomDialog
        visible={showLoginDialog}
        title="Login Required"
        message="You need to log in to add products to the cart."
        primaryLabel="Login"
        primaryAction={() => {
          setShowLoginDialog(false);
          onSaveProductLocallyAndLogin();
        }}
        secondaryLabel="Cancel"
        secondaryAction={() => setShowLoginDialog(false)}
        onDismiss={() => setShowLoginDialog(false)}
      />
    </>
  );
};

export default ProductScreen;
