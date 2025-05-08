import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {ProductType} from '../ProductPage';
import {calculateDiscountPercentage} from '../../utils/percentage/calculateDiscountPercentage';
import {useAppSelector} from '../../redux/store';
import {getDiscountBasedOnRole} from '../../utils/products/getDiscountBasedOnRole';

type SimilarProductsProps = {
  products: ProductType[];
};

const SimilarProducts = ({products}: SimilarProductsProps) => {
  const reduxAuth = useAppSelector(state => state.auth);
  const reduxUser = reduxAuth.user;
  const reduxUserRole = reduxUser?.role || 'user';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Similar Products</Text>

      <FlatList
        horizontal
        data={products}
        keyExtractor={item => item._id}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => {
          const discountPrice = getDiscountBasedOnRole({
            role: reduxUserRole,
            discounted_price: item.discounted_price,
            original_price: item.price,
            salesperson_discounted_price: item.salesperson_discounted_price,
            dnd_discounted_price: item.dnd_discounted_price,
          });

          const discountPercentage = calculateDiscountPercentage(
            item.price,
            discountPrice,
          );
          return (
            <TouchableOpacity style={styles.productCard}>
              <Image
                source={{uri: item.images?.[0]}}
                style={styles.productImage}
              />
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{item.discounted_price}</Text>
                <Text style={styles.original}>/{item.price}</Text>
                {discountPercentage && (
                  <Text style={styles.discount}>
                    {' '}
                    {discountPercentage}% Off
                  </Text>
                )}
              </View>
              <Text style={styles.productName} numberOfLines={1}>
                {item.name}
              </Text>
              {item.small_description && (
                <Text style={styles.productDescription} numberOfLines={1}>
                  {item.small_description}
                </Text>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginLeft: 5,
  },
  productCard: {
    width: 150,
    marginRight: 15,
    marginVertical: 2,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  productImage: {
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#297C00',
  },
  original: {
    fontSize: 12,
    color: '#56565680',
    textDecorationLine: 'line-through',
    marginLeft: 5,
  },
  discount: {
    fontSize: 12,
    color: '#00008B',
    fontWeight: 'bold',
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  productDescription: {
    fontSize: 11,
    color: '#4D4D4D',
  },
});

export default SimilarProducts;
