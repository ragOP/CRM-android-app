import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import ContentLoader, {Rect} from 'react-content-loader/native'; // For skeleton loader

type CartHeaderProps = {
  deliverTo: string;
  onChangePress: () => void;
  isAddressLoading?: boolean;
};

const CartHeader = ({
  deliverTo,
  onChangePress,
  isAddressLoading,
}: CartHeaderProps) => (
  <View style={styles.headerContainer}>
    <Text style={styles.cartTitle}>My Cart</Text>
    <View style={styles.deliveryRow}>
      <Text style={styles.deliveryText}>Deliver to: </Text>
      {isAddressLoading ? (
        // Skeleton Loader
        <ContentLoader
          speed={1.5}
          width={200}
          height={20}
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb">
          <Rect x="0" y="0" rx="4" ry="4" width="200" height="20" />
        </ContentLoader>
      ) : (
        <Text
          style={styles.deliveryAddress}
          numberOfLines={2}
          ellipsizeMode="tail">
          {deliverTo}
        </Text>
      )}
      {!isAddressLoading && (
        <TouchableOpacity onPress={onChangePress} style={styles.changeButton}>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

export default CartHeader;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 2,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  deliveryText: {
    fontSize: 14,
    color: '#767676',
    flexShrink: 0,
  },
  deliveryAddress: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    flex: 1,
    marginLeft: 4,
  },
  changeButton: {
    marginLeft: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4D4D4D',
  },
  changeText: {
    fontSize: 12,
    color: '#00008B',
    fontFamily: 'Segoe UI',
  },
});
