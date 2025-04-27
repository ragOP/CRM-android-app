import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface CartHeaderProps {
  deliverTo: string;
  onChangePress: () => void;
}

const CartHeader: React.FC<CartHeaderProps> = ({deliverTo, onChangePress}) => (
  <View style={styles.headerContainer}>
    <Text style={styles.cartTitle}>My Cart</Text>
    <View style={styles.deliveryRow}>
      <Text style={styles.deliveryText}>Deliver to : </Text>
      <Text style={styles.deliveryAddress}>{deliverTo}</Text>
      <TouchableOpacity onPress={onChangePress} style={styles.changeButton}>
        <Text style={styles.changeText}>Change</Text>
      </TouchableOpacity>
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
  },
  deliveryText: {
    fontSize: 14,
    color: '#767676',
  },
  deliveryAddress: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  changeButton: {
    marginLeft: 'auto',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4D4D4D'
  },
  changeText: {
    fontSize: 12,
    color: '#00008B',
    fontFamily: 'Segoe UI'
  },
});
