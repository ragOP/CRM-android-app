import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import CustomSearch from '../../components/CustomSearch';
import ProductPage from '../../components/ProductPage';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useAppSelector} from '../../redux/store';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {addCart} from '../../apis/addCart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchProducts} from '../../apis/fetchProducts';
import ProductGrid from '../../components/ProductGrid';

const ProductScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const reduxToken = useAppSelector(state => state.auth.token);
  const reduxUser = useAppSelector(state => state.auth.user);

  const reduxUserId = reduxUser?.id;

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
    <ScrollView>
      <Pressable onPress={() => navigation.navigate('UniversalSearch')}>
        <CustomSearch />
      </Pressable>
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
    </ScrollView>
  );
};

export default ProductScreen;
