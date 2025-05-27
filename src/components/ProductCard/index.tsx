import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {getItem} from '../../utils/local_storage';
import {apiService} from '../../utils/api/apiService';
import {endpoints} from '../../utils/endpoints';
import {showSnackbar} from '../../redux/slice/snackbarSlice';
import CustomDialog from '../CustomDialog/CustomDialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import InventoryBadge from '../InventoryBadge';

type ProductCardProps = {
  data: any;
  image: any;
  price: number;
  originalPrice: number;
  discount?: string | number;
  title: string;
  subtitle: string;
};

const ProductCard = ({
  data,
  image,
  price,
  originalPrice,
  discount,
  title,
  subtitle,
}: ProductCardProps) => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector(state => state.auth.token);

  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handlePress = () => {
    navigation.navigate('HomeTab', {
      screen: 'ProductScreen',
      params: {product: data},
    });
  };

  const onLoginRedirect = async () => {
    const productData = {
      product_id: data?._id,
      quantity: 1,
    };

    const dataToSave = {
      product: productData,
      timestamp: Date.now(),
    };

    await AsyncStorage.setItem('tempProduct', JSON.stringify(dataToSave));

    navigation.navigate('Account', {
      screen: 'LoginScreen',
    });
  };

  const {mutate: addToCartMutate, isPending} = useMutation({
    mutationFn: async (product_id: string) => {
      const userData = await getItem('userData');

      const payload = {
        product_id,
        quantity: 1,
        user_id: userData.userId,
      };

      const apiResponse = await apiService({
        endpoint: endpoints.cart,
        method: 'POST',
        data: payload,
        token: userData.token,
      });

      return apiResponse;
    },
    onSuccess: () => {
      dispatch(
        showSnackbar({
          type: 'success',
          title: 'Product added to cart successfully!',
          placement: 'top',
        }),
      );
      queryClient.invalidateQueries({queryKey: ['cart_products']});
    },
  });

  const handleAddToCart = () => {
    const productId = data?._id;
    if (data?.inventory <= 0) {
      dispatch(
        showSnackbar({
          type: 'error',
          title: 'Product is out of stock!',
          placement: 'top',
        }),
      );
      return;
    }
    if (isLoggedIn) {
      addToCartMutate(productId);
    } else {
      setShowLoginDialog(true);
    }
  };

  const handleBuyNow = () => {
    // Buy now logic here
  };

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        style={styles.card}
        activeOpacity={0.9}>
        <View style={styles.topContainer}>
          <View style={styles.badgeContainer}>
            <InventoryBadge productInventory={data?.inventory} />
          </View>
          <Image source={{uri: image}} style={styles.image} />
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{price}</Text>
            <Text style={styles.original}>/{originalPrice}</Text>
            {discount && <Text style={styles.discount}> {discount} Off</Text>}
          </View>
          <Text style={styles.title} numberOfLines={3}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buyBtn} onPress={handleAddToCart}>
            <Icon name="cart-outline" size={16} color="#fff" />
            <Text style={styles.buyBtnText}>Add to Cart</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow}>
            <Text style={styles.buyBtnText}>Buy Now</Text>
          </TouchableOpacity> */}
        </View>
      </TouchableOpacity>

      <CustomDialog
        visible={showLoginDialog}
        title="Login Required"
        message="You need to log in to add products to the cart."
        primaryLabel="Login"
        primaryAction={() => {
          setShowLoginDialog(false);
          onLoginRedirect();
        }}
        secondaryLabel="Cancel"
        secondaryAction={() => setShowLoginDialog(false)}
        onDismiss={() => setShowLoginDialog(false)}
      />
    </>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    width: '48%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  topContainer: {
    padding: 10,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    color: '#297C00',
    fontWeight: 'bold',
  },
  original: {
    color: '#56565680',
    textDecorationLine: 'line-through',
    marginLeft: 5,
  },
  discount: {
    color: '#00008B',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  title: {
    fontWeight: '600',
    fontSize: 13,
  },
  subtitle: {
    color: '#4D4D4D',
    fontSize: 11,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  cartBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  cartBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  buyBtn: {
    flex: 1,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    borderColor: 'transparent',
    backgroundColor: '#00008B',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  buyBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  badgeContainer: {
    position: 'absolute',
    top: 7,
    right: 7,
    zIndex: 1,
  },
});
