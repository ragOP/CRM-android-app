import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs';
import {useQuery} from '@tanstack/react-query';
import {getAllCoupons} from '../../../apis/getAllCoupons';

interface Coupon {
  code: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  maxDiscount?: number;
  description?: string;
  endDate: string;
}

interface CouponDialogProps {
  visible: boolean;
  onClose: () => void;
  appliedCoupons: Coupon[];
  onApplyCoupon: (coupons: Coupon[]) => void;
  onRemoveCoupon: () => void;
}

const CouponDialog: React.FC<CouponDialogProps> = ({
  visible,
  onClose,
  appliedCoupons,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {data: availableCoupons, isLoading} = useQuery({
    queryKey: ['available_coupons'],
    queryFn: getAllCoupons,
    select: data => data?.response || [],
  });

  console.log('availableCoupons', availableCoupons);

  const handleApplyCoupon = (code: string) => {
    if (!code) {
      setErrorMessage('Please enter a coupon code');
      return;
    }
    const coupon = availableCoupons?.find((c: Coupon) => c.code === code);
    if (coupon) {
      onApplyCoupon(coupon);
      setErrorMessage('');
      setCouponCode('');
    } else {
      setErrorMessage('Invalid coupon code');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Apply Coupons</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {/* Applied Coupon */}
              {appliedCoupons.length > 0 && (
                <View style={styles.appliedSection}>
                  <Text style={styles.appliedTitle}>Applied Coupon</Text>
                  <View style={styles.appliedCoupon}>
                    <View>
                      <Text style={styles.couponCode}>
                        {appliedCoupons[0].code}
                      </Text>
                      <Text style={styles.couponDescription}>
                        {appliedCoupons[0].description ||
                          `Get ${
                            appliedCoupons[0].discountType === 'percentage'
                              ? `${appliedCoupons[0].discountValue}% off${
                                  appliedCoupons[0].maxDiscount
                                    ? `, up to ₹${appliedCoupons[0].maxDiscount}`
                                    : ''
                                }`
                              : `₹${appliedCoupons[0].discountValue} off`
                          }`}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={onRemoveCoupon}>
                      <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Available Coupons */}
              <Text style={styles.sectionTitle}>
                {}Showing {availableCoupons?.length || 0} coupons
              </Text>
              {isLoading ? (
                <ActivityIndicator size="large" color="#007AFF" />
              ) : availableCoupons && availableCoupons.length > 0 ? (
                availableCoupons.map(item => (
                  <View
                    key={item.code}
                    style={[
                      styles.couponCard,
                      appliedCoupons.length > 0 &&
                        appliedCoupons[0].code !== item.code && {
                          opacity: 0.5,
                        },
                    ]}>
                    <View style={styles.couponDetails}>
                      <Text style={styles.couponCode}>{item.code}</Text>
                      <Text style={styles.couponDescription}>
                        {item.description ||
                          `Get ${
                            item.discountType === 'percentage'
                              ? `${item.discountValue}% off${
                                  item.maxDiscount
                                    ? `, up to ₹${item.maxDiscount}`
                                    : ''
                                }`
                              : `₹${item.discountValue} off`
                          }`}
                      </Text>
                      <Text style={styles.couponExpiry}>
                        Expires on {dayjs(item.endDate).format('DD/MM/YYYY')}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.applyButton}
                      onPress={() => handleApplyCoupon(item.code)}
                      disabled={
                        appliedCoupons.length > 0 &&
                        appliedCoupons[0].code !== item.code
                      }>
                      <Text style={styles.applyButtonText}>Apply</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No coupons available</Text>
              )}

              {/* Coupon Input */}
              <View style={styles.inputSection}>
                <Text style={styles.sectionTitle}>Have another coupon?</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChangeText={text => setCouponCode(text.toUpperCase())}
                  />
                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => handleApplyCoupon(couponCode)}>
                    <Text style={styles.applyButtonText}>Apply</Text>
                  </TouchableOpacity>
                </View>
                {errorMessage ? (
                  <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CouponDialog;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    minHeight: 600,
  },
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    minHeight: 600,
    // padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: '#ececec',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  appliedSection: {
    marginBottom: 16,
  },
  appliedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 8,
  },
  appliedCoupon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  couponCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  couponDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  couponExpiry: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  removeText: {
    fontSize: 12,
    color: '#E53935',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  couponCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  couponDetails: {
    flex: 1,
    marginRight: 8,
  },
  applyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  applyButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },
  inputSection: {
    marginTop: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#E53935',
    marginTop: 8,
  },
});
