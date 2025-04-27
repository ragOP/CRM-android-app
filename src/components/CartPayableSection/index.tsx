import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CartPayableSectionProps {
  totalAmount: number;
  onPlaceOrder: () => void;
}

const CartPayableSection: React.FC<CartPayableSectionProps> = ({
  totalAmount,
  onPlaceOrder,
}) => (
  <View style={styles.payableContainer}>
    <View>
      <Text style={styles.payableLabel}>Payable Amount</Text>
      <View style={styles.payableRow}>
        <Text style={styles.payableAmount}>₹{totalAmount}</Text>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Icon name="information-outline" size={18} color="#4D4D4D" />
        </View>
      </View>
    </View>
    <TouchableOpacity style={styles.placeOrderButton} onPress={onPlaceOrder}>
      <Text style={styles.placeOrderText}>Place Order</Text>
    </TouchableOpacity>
  </View>
);

export default CartPayableSection;

const styles = StyleSheet.create({
  payableContainer: {
    backgroundColor: '#82C8E51A',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 1,
    marginBottom: 8,
  },
  payableLabel: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  payableRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payableAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 6,
    color: '#297C00',
  },
  placeOrderButton: {
    backgroundColor: '#00008B',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 25,
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
