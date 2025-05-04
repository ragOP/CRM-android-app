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
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {addCart} from '../../apis/addCart';

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

  const onAddToCart = () => {
    if (!reduxToken) {
      Alert.alert(
        'Login Required',
        'You need to log in to add products to the cart.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Login',
            onPress: () => navigation.navigate('Account'),
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

  return (
    <ScrollView>
      <Pressable onPress={() => navigation.navigate('UniversalSearch')}>
        <CustomSearch />
      </Pressable>
      <ProductPage product={product} onAddToCart={onAddToCart} />
    </ScrollView>
  );
};

export default ProductScreen;
