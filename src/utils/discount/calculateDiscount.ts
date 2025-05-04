import {Coupon} from '../../components/CartOfferSection/components/CouponDialog';

export const calculateDiscount = (
  totalPrice: number,
  coupon: Coupon,
): number => {
  if (!coupon) {
    return 0;
  }

  let discount = 0;

  if (coupon.discountType === 'fixed') {
    // Fixed discount
    discount = coupon.discountValue;
  } else if (coupon.discountType === 'percentage') {
    // Percentage-based discount
    discount = (totalPrice * coupon.discountValue) / 100;

    // Apply max discount limit if specified
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  }

  // Ensure discount does not exceed the total price
  return Math.min(discount, totalPrice);
};
