import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import DottedHorizontalRule from '../DottedHorizontalRule';

interface CartBillSummaryProps {
  itemTotal: number;
  platformFee: number;
  discount: number;
  shippingFee: number | string;
  totalAmount: number;
}

const CartBillSummary: React.FC<CartBillSummaryProps> = ({
  itemTotal,
  platformFee,
  discount,
  shippingFee,
  totalAmount,
}) => (
  <View style={styles.billContainer}>
    <Text style={styles.billTitle}>Bill Summary</Text>
    <View style={styles.billRow}>
      <Text style={styles.billLabel}>Item total (MRP)</Text>
      <Text style={styles.billValue}>₹{itemTotal}</Text>
    </View>
    <View style={styles.billRow}>
      <Text style={styles.billLabel}>Platform fee</Text>
      <Text style={styles.billValue}>₹{platformFee}</Text>
    </View>
    <View style={styles.billRow}>
      <Text style={[styles.billLabel, styles.discountValue]}>Total discount</Text>
      <Text style={[styles.billValue, styles.discountValue]}>-₹{discount}</Text>
    </View>
    <View style={styles.billRow}>
      <Text style={[styles.billLabel, styles.discountValue]}>Shipping fee</Text>
      <Text style={[styles.billLabel, styles.discountValue]}>
        {typeof shippingFee === 'string' ? shippingFee : `₹${shippingFee}`}
      </Text>
    </View>
    <View style={styles.separator} />
    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>To be paid</Text>
      <Text style={styles.totalValue}>₹{totalAmount}</Text>
    </View>
    <View style={styles.separator} />
  </View>
);

export default CartBillSummary;

const styles = StyleSheet.create({
  billContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1A1A1A'
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 14,
    color: '#333333',
  },
  billValue: {
    fontSize: 14,
    color: '#1A1A1A'
  },
  discountValue: {
    color: '#297C00',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A'
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A'
  },
});
