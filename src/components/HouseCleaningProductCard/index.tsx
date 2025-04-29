import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface HouseCleaningProductCardProps {
    _id: string;
    name: string;
    small_description: string;
    banner_image: string;
    price: number;
    discounted_price: number;
    onPress?: (_id: string) => void;
    isPending?: boolean;
}

const HouseCleaningProductCard: React.FC<HouseCleaningProductCardProps> = ({
    _id,
    name,
    small_description,
    banner_image,
    price,
    discounted_price,
    onPress,
    isPending,
 }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: banner_image }} style={styles.image} />

      <Text style={styles.title}>{name}</Text>
      <Text style={styles.description}>{small_description}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{discounted_price}</Text>
        <Text style={styles.oldPrice}>₹{price}</Text>
      </View>

      <View style={styles.deliveryRow}>
        <Icon name="truck" size={14} />
        <Text style={{ marginLeft: 5 }}>Delivery in 2-4 days | 🚀 Fast Delivery</Text>
      </View>
      <Text style={styles.returnPolicy}>🔁 7-day return Return Policy</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity  onPress={() => {
          onPress && onPress(_id);
        }} style={styles.cartBtn}>
          <Text style={{ color: 'white' }}>{isPending ? 'Loading...' : 'Add to Cart'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowBtn}>
          <Text style={{ color: 'white' }}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  info: { flex: 1, padding: 10 },
  name: { fontSize: 16, fontWeight: 'bold' },
  desc: { fontSize: 12, color: '#666' },
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

  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    margin: 10,
    width: 300,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    color: '#202937',
  },
  description: {
    color: '#666',
    marginBottom: 5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  oldPrice: {
    fontSize: 14,
    color: '#888',
    marginLeft: 8,
    textDecorationLine: 'line-through',
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    flexWrap: 'wrap',
    gap: 4,
  },
  reviewText: {
    marginLeft: 6,
    marginRight: 4,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  colorBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderColor: '#aaa',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  returnPolicy: {
    marginTop: 4,
    fontSize: 13,
    color: '#444',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 8,
  },
  cartBtn: {
    backgroundColor: '#6603fc',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buyNowBtn: {
    backgroundColor: '#036bfc',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
});

export default HouseCleaningProductCard;
