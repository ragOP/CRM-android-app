import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

interface HouseCleaningProductCardProps {
    _id: string;
    name: string;
    small_description: string;
    banner_image: string;
    price: number;
    discounted_price: number;
}

const HouseCleaningProductCard: React.FC<HouseCleaningProductCardProps> = ({
    _id,
    name,
    small_description,
    banner_image,
    price,
    discounted_price,
 }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => console.log('Product pressed')}>
      <Image source={{ uri: banner_image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.desc}>{small_description}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{price}</Text>
          {discounted_price && (
            <Text style={styles.strike}>₹{discounted_price}</Text>
          )}
          
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => console.log('Add to cart pressed')} >
            <Text style={styles.btnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fefefe',
    borderRadius: 12,
    marginVertical: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  image: { width: 100, height: 100 },
  info: { flex: 1, padding: 10 },
  name: { fontSize: 16, fontWeight: 'bold' },
  desc: { fontSize: 12, color: '#666' },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#00008B' },
  strike: { marginLeft: 8, textDecorationLine: 'line-through', color: '#999' },
  discount: { marginLeft: 8, color: 'red', fontWeight: 'bold', fontSize: 12 },
  addBtn: {
    backgroundColor: '#00008B',
    marginTop: 10,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '600' },
});

export default HouseCleaningProductCard;
