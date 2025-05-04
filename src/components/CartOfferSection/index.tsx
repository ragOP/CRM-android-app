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
            <Text style={styles.loginText}>Login to apply coupon</Text>
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
  loginText: {
    fontSize: 12,
    color: '#C62828',
    marginLeft: 26,
    flex: 1,
    fontWeight: '300',
  },
});

// import React, {useState} from 'react';
// import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

// type CartHeaderProps = {
//   deliverTo: string;
//   onChangePress: () => void;
// };

// const CartHeader = ({deliverTo, onChangePress}: CartHeaderProps) => {
//   const [isCouponDialogVisible, setCouponDialogVisible] = useState(false);
//   const [appliedCoupons, setAppliedCoupons] = useState([]);

//   const handleApplyCoupon = () => {
//     setCouponDialogVisible(true);
//   };

//   const handleCloseCouponDialog = () => {
//     setCouponDialogVisible(false);
//   };

//   return (
//     <View style={styles.headerContainer}>
//       <Text style={styles.cartTitle}>My Cart</Text>
//       <View style={styles.deliveryRow}>
//         <Text style={styles.deliveryText}>Deliver to: </Text>
//         <Text
//           style={styles.deliveryAddress}
//           numberOfLines={2}
//           ellipsizeMode="tail">
//           {deliverTo}
//         </Text>
//         <TouchableOpacity onPress={onChangePress} style={styles.changeButton}>
//           <Text style={styles.changeText}>Change</Text>
//         </TouchableOpacity>
//       </View>
//       <TouchableOpacity onPress={handleApplyCoupon} style={styles.couponButton}>
//         <Text style={styles.couponText}>Apply Coupon</Text>
//       </TouchableOpacity>

//       {/* Coupon Dialog */}
//       <CouponDialog
//         visible={isCouponDialogVisible}
//         onClose={handleCloseCouponDialog}
//         appliedCoupons={appliedCoupons}
//         setAppliedCoupons={setAppliedCoupons}
//       />
//     </View>
//   );
// };

// export default CartHeader;

// const styles = StyleSheet.create({
//   headerContainer: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   cartTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginBottom: 2,
//   },
//   deliveryRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'nowrap',
//   },
//   deliveryText: {
//     fontSize: 14,
//     color: '#767676',
//     flexShrink: 0,
//   },
//   deliveryAddress: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#1A1A1A',
//     flex: 1,
//     marginLeft: 4,
//   },
//   changeButton: {
//     marginLeft: 8,
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 15,
//     borderWidth: 1,
//     borderColor: '#4D4D4D',
//   },
//   changeText: {
//     fontSize: 12,
//     color: '#00008B',
//     fontFamily: 'Segoe UI',
//   },
//   couponButton: {
//     marginTop: 16,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     backgroundColor: '#007AFF',
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   couponText: {
//     fontSize: 14,
//     color: '#fff',
//     fontWeight: '600',
//   },
// });
