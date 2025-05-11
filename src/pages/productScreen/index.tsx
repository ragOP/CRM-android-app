import React from 'react';
import {ScrollView, Alert} from 'react-native';
import CustomSearch from '../../components/CustomSearch';
import ProductPage from '../../components/ProductPage';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useAppSelector} from '../../redux/store';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {addCart} from '../../apis/addCart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchProducts} from '../../apis/fetchProducts';
import ProductGrid from '../../components/ProductGrid';
import ProductReviews from './components/ProductReviews';
import RefreshControlWrapper from '../../components/RefreshControlWrapper/RefreshControlWrapper';

const ProductScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const reduxToken = useAppSelector(state => state.auth.token);
  const reduxUser = useAppSelector(state => state.auth.user);

  const reduxUserId = reduxUser?.id;

  const [refreshing, setRefreshing] = React.useState(false);

  const {product} = route.params || {};

  const {mutate: addToCartMutation, isPending} = useMutation({
    mutationFn: ({payload}) =>
      addCart({
        payload: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['cart_products']});
      Alert.alert('Success', 'Product added to cart successfully!');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to add product to cart. Please try again.');
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
      Alert.alert(
        'Login Required',
        'You need to log in to add products to the cart.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Login',
            onPress: () => onSaveProductLocallyAndLogin(),
          },
        ],
      );
      return;
    }

    const payload = {
      user_id: reduxUserId,
      product_id: product?._id,
      quantity: 1,
    };

    addToCartMutation({payload});
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
    <RefreshControlWrapper refreshing={refreshing} onRefresh={onRefresh}>
      <CustomSearch redirectToUniversalScreen={true} />
      <ProductPage product={product} onAddToCart={onAddToCart} />

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
  );
};

export default ProductScreen;
