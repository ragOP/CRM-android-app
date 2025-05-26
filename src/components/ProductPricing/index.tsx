import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import InventoryBadge from '../InventoryBadge';

interface ProductPricingProps {
  mrp: number;
  discountPrice: number;
  discountPercent?: number;
  specialOffer?: string;
  productName?: string;
  productDescription?: string;
  highlight?: {[key: string]: boolean};
  inventory?: number;
}

const ProductPricing = ({
  mrp,
  discountPrice,
  discountPercent,
  specialOffer,
  productName,
  productDescription,
  highlight = {},
  inventory,
}: ProductPricingProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹{discountPrice}*</Text>
        <Text style={styles.mrp}>MRP ₹{mrp}</Text>
      </View>
      <View style={styles.offersContainer}>
        <Text style={styles.freeDelivery}>
          Free <Text style={{color: '#333333'}}>Delivery</Text>
        </Text>
        <InventoryBadge productInventory={inventory || 0} />
        {specialOffer && (
          <View style={styles.specialOffer}>
            <Text style={styles.specialOfferText}>
              {specialOffer.split(' ').map((word, index) => {
                const lowerWord = word
                  .toLowerCase()
                  .replace(/[^a-z0-9%]/gi, '');
                return (
                  <Text
                    key={index}
                    style={highlight[lowerWord] ? styles.highlight : null}>
                    {word + ' '}
                  </Text>
                );
              })}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.productName}>{productName}</Text>
      <Text style={styles.productDescription}>{productDescription}</Text>
    </View>
  );
};

export default ProductPricing;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F7F7',
    padding: 15,
    borderBottomWidth: 10,
    borderBottomColor: '#f0f0f0',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#297C00',
  },
  mrp: {
    fontSize: 14,
    color: '#4D4D4D',
    marginLeft: 10,
    textDecorationLine: 'line-through',
  },
  offersContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  freeDelivery: {
    backgroundColor: 'rgba(130, 200, 229, 0.3)',
    fontSize: 12,
    color: '#333333',
    marginRight: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  specialOffer: {
    backgroundColor: 'rgba(130, 200, 229, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    color: '#333333',
  },
  specialOfferText: {
    fontSize: 12,
    color: '#333333',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginTop: 10,
  },
  productDescription: {
    fontSize: 14,
    color: '#000000',
    marginTop: 5,
    lineHeight: 20,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#00008B',
  },
});
