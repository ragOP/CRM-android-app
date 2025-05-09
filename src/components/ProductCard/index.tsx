import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

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

  const handlePress = () => {
    navigation.navigate('HomeTab', {
      screen: 'ProductScreen',
      params: {product: data},
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      <Image source={{uri: image}} style={styles.image} />
      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{price}</Text>
        <Text style={styles.original}>/{originalPrice}</Text>
        {discount && <Text style={styles.discount}> {discount} Off</Text>}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
});
