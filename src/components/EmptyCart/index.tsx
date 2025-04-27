import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface EmptyCartProps {
  onShopNow: () => void;
}

const EmptyCart: React.FC<EmptyCartProps> = ({ onShopNow }) => (
    <View style={styles.emptyCart}>
      <Icon name="cart" size={60} color="#ccc" />
      <Text style={styles.emptyCartText}>Your cart is empty</Text>
      <TouchableOpacity style={styles.shopNowButton} onPress={onShopNow}>
        <Text style={styles.shopNowText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  );
  
export default EmptyCart;

const styles = StyleSheet.create({
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#fff',
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: '500',
    marginVertical: 16,
  },
  shopNowButton: {
    backgroundColor: '#00008B',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 16,
  },
  shopNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});