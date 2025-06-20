import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

type AddToCartBarParams = {
  onAddToCart: () => void;
  onBuyNow: () => void;
};

const AddToCartBar = ({onAddToCart, onBuyNow}: AddToCartBarParams) => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TouchableOpacity style={styles.addToCartButton} onPress={onBuyNow}>
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowButton} onPress={onAddToCart}>
          <Text style={styles.addToCartText}>Add To Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddToCartBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#82C8E5',
    paddingVertical: 12,
  },
  addToCartText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#00008B',
    paddingVertical: 12,
  },
  buyNowText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
