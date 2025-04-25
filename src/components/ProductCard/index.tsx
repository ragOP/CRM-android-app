import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

interface ProductCardProps {
  image: any;
  price: number;
  originalPrice: number;
  discount: string;
  title: string;
  subtitle: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  price,
  originalPrice,
  discount,
  title,
  subtitle,
}) => {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{price}</Text>
        <Text style={styles.original}>/{originalPrice}</Text>
        <Text style={styles.discount}> {discount} Off</Text>
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {subtitle}
      </Text>
    </View>
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
    shadowOffset: { width: 0, height: 1 },
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
    color: '#777',
    fontSize: 11,
  },
});
