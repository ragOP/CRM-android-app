import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ProductVariantProps {
  variants: {
    weight: string;
    price: number;
    pricePerGram: string;
    inStock: boolean;
    stockStatus?: 'In Stock' | 'Out of Stock' | 'Only 2 Left'; 
  }[];
}

const ProductVariants: React.FC<ProductVariantProps> = ({ variants }) => {
  const [selectedVariant, setSelectedVariant] = useState(1); // Set 454gm as initially selected
  
  // Helper function to determine text color based on stock status
  const getStockTextColor = (variant: ProductVariantProps['variants'][0]) => {
    if (!variant.inStock) return '#C62828'; // Red for Out of Stock
    if (variant.stockStatus === 'Only 2 Left') return '#D9A600'; // Orange for limited stock
    return '#297C00'; // Green for In Stock
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.variantsContainer}>
        {variants.map((variant, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.variantCard,
              selectedVariant === index && styles.selectedVariant,
            ]}
            onPress={() => setSelectedVariant(index)}
          >
            <View style={[
              styles.cardContent,
              !variant.inStock && styles.outOfStockContent
            ]}>
              <Text style={styles.weightText}>{variant.weight}</Text>
              <View style={styles.separator} />
              <Text style={styles.priceText}>₹{variant.price}</Text>
              <Text style={styles.pricePerGramText}>({variant.pricePerGram})</Text>
              <Text style={[
                styles.stockText, 
                { color: getStockTextColor(variant) }
              ]}>
                {variant.stockStatus || (variant.inStock ? 'In Stock' : 'Out of Stock')}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ProductVariants;

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  variantsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  variantCard: {
    width: '24%',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedVariant: {
    borderColor: '#82C8E5',
    borderWidth: 1,
  },
  cardContent: {
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    padding: 4,
  },
  outOfStockContent: {
    opacity: 1,
  },
  weightText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#121414',
    paddingVertical: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    width: '100%',
    marginVertical: 2,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#121414',
    marginTop: 2,
  },
  pricePerGramText: {
    fontSize: 12,
    color: '#71716E',
    marginTop: 2,
  },
  stockText: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },
});