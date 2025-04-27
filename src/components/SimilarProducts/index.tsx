import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

interface SimilarProductsProps {
  products: {
    id: string;
    name: string;
    image: string;
    price: number;
    mrp: number;
    discountPercent?: number;
    description?: string;
  }[];
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ products }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Similar Products</Text>
      
      <FlatList
        horizontal
        data={products}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{item.price}</Text>
              <Text style={styles.original}>/{item.mrp}</Text>
              {item.discountPercent && (
                <Text style={styles.discount}> {item.discountPercent}% Off</Text>
              )}
            </View>
            <Text style={styles.productName} numberOfLines={1}>
              {item.name}
            </Text>
            {item.description && (
              <Text style={styles.productDescription} numberOfLines={1}>
                {item.description}
              </Text>
            )}
          </TouchableOpacity>
        )}
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
    shadowOffset: { width: 0, height: 1 },
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