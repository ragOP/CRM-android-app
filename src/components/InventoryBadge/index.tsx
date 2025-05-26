import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface InventoryBadgeProps {
  productInventory: number;
}

const InventoryBadge: React.FC<InventoryBadgeProps> = ({ productInventory }) => {
  console.log("productInventory", productInventory);
  if (productInventory > 10) return null;

  let label = '';
  let badgeStyle = styles.lowStock;

  if (productInventory === 0) {
    label = 'Out of stock';
    badgeStyle = styles.outOfStock;
  } else {
    label = `${productInventory} item${productInventory > 1 ? 's' : ''} left`;
  }

  return (
    <View style={[styles.badge, badgeStyle]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 3,
    marginLeft: 5,
  },
  outOfStock: {
    backgroundColor: '#f44336', // red
  },
  lowStock: {
    backgroundColor: '#ff9800', // orange
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default InventoryBadge;
