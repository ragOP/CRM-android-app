import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface HouseCleaningProductsProps {
    _id: string;
    name: string;
    small_description: string;
    banner_image: string;
    price: number;
    discounted_price: number;
}

const HouseCleaningProducts : React.FC<HouseCleaningProductsProps> = ({ 
  _id,
  name,
  small_description,
  banner_image,
  price,
  discounted_price,
 }) => {
  // console.log("product", product);
  return (
    <View style={styles.card}>
      <Image source={{ uri: banner_image }} style={styles.image} />

      <Text style={styles.title}>{name}</Text>
      <Text style={styles.description}>{small_description}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{discounted_price}</Text>
        <Text style={styles.oldPrice}>₹{price}</Text>
      </View>

      {/* <View style={styles.reviewRow}>
        <View style={{ flexDirection: 'row' }}>
          {[...Array(5)].map((_, i) => (
            <Icon key={i} name="star" color="gold" size={16} />
          ))}
        </View>
        <Text style={styles.reviewText}>({product.reviews} reviews)</Text>
        <Icon name="check-circle" size={16} color="green" />
        <Text style={{ marginLeft: 4 }}>Verified Buyers</Text>
      </View> */}

      {/* <View style={styles.colorRow}>
        {product.colors.map((color, _id) => (
          <TouchableOpacity key={_id} style={styles.colorBtn}>
            <Text>{color}</Text>
          </TouchableOpacity>
        ))}
      </View> */}

      <View style={styles.deliveryRow}>
        <Icon name="truck" size={14} />
        <Text style={{ marginLeft: 5 }}>Delivery in 2-4 days | 🚀 Fast Delivery</Text>
      </View>
      <Text style={styles.returnPolicy}>🔁 7-day return Return Policy</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cartBtn}>
          <Text style={{ color: 'white' }}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowBtn}>
          <Text style={{ color: 'white' }}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HouseCleaningProducts ;

const styles = StyleSheet.create({
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
    backgroundColor: 'purple',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buyNowBtn: {
    backgroundColor: '#1d4ed8',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
});
