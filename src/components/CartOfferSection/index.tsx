import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CartOfferSectionProps {
  onApplyCoupon: () => void;
}

const CartOfferSection: React.FC<CartOfferSectionProps> = ({onApplyCoupon}) => (
  <View style={styles.offerContainer}>
    <Text style={styles.offerTitle}>Offers & Discounts</Text>
    <TouchableOpacity style={styles.couponButton} onPress={onApplyCoupon}>
      <View style={{flexDirection: 'column', alignItems: 'flex-start', flex: 1}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}> 
          <Icon name="tag" size={18} color="#333" />
          <Text style={styles.couponText}>Apply coupon</Text>
        </View>
        <Text style={styles.loginText}>Login to apply coupon</Text>
      </View>
      <Icon name="chevron-right" size={18} color="#333" />
    </TouchableOpacity>
  </View>
);

export default CartOfferSection;

const styles = StyleSheet.create({
  offerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  couponButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  couponText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    color: '#333333'
  },
  loginText: {
    fontSize: 12,
    color: '#C62828',
    marginLeft: 26,
    flex: 1,
    fontWeight: '300'
  },
});
