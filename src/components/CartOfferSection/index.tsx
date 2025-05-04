import {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CouponDialog from './components/CouponDialog';

interface CartOfferSectionProps {
  onApplyCoupon: (coupon: any) => void;
  discountCoupon: any;
  onRemoveCoupon: () => void;
}

const CartOfferSection = ({
  onApplyCoupon,
  discountCoupon,
  onRemoveCoupon,
}: CartOfferSectionProps) => {
  const [isCouponDialogVisible, setCouponDialogVisible] = useState(false);

  const handleApplyCoupon = () => {
    setCouponDialogVisible(true);
  };

  const handleCloseCouponDialog = () => {
    setCouponDialogVisible(false);
  };

  return (
    <>
      <View style={styles.offerContainer}>
        <Text style={styles.offerTitle}>Offers & Discounts</Text>
        <TouchableOpacity
          style={styles.couponButton}
          onPress={handleApplyCoupon}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              flex: 1,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="tag" size={18} color="#333" />
              <Text style={styles.couponText}>Apply coupon</Text>
            </View>
            {discountCoupon && (
              <Text style={styles.couponSelectedText}>
                {discountCoupon?.code} coupon selected
              </Text>
            )}
          </View>
          <Icon name="chevron-right" size={18} color="#333" />
        </TouchableOpacity>
      </View>

      <CouponDialog
        visible={isCouponDialogVisible}
        onClose={handleCloseCouponDialog}
        appliedCoupons={discountCoupon}
        onApplyCoupon={onApplyCoupon}
        onRemoveCoupon={onRemoveCoupon}
      />
    </>
  );
};

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
    color: '#333333',
  },
  couponSelectedText: {
    fontSize: 12,
    color: 'green',
    mt: 10,
    marginLeft: 26,
    flex: 1,
    fontWeight: '300',
  },
});
