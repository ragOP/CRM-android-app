import {getDiscountBasedOnRole} from '../utils/products/getDiscountBasedOnRole';

export const getTaxAmount = (products, couponPrice = 0, address = {}, role) => {
  const SELLER_STATE_CODE = 'GJ'; // Gujarat

  const totalNetAmount = products.reduce((sum, item) => {
    const price = getDiscountBasedOnRole({
      role,
      discounted_price: item.product.discounted_price,
      salesperson_discounted_price: item.product.salesperson_discounted_price,
      dnd_discounted_price: item.product.dnd_discounted_price,
      original_price: item.product.price,
    });
    return sum + price * item.quantity;
  }, 0);

  const totalAmount = totalNetAmount;
  let totalTax = 0;

  products.forEach(item => {
    const price = getDiscountBasedOnRole({
      role,
      discounted_price: item.product.discounted_price,
      salesperson_discounted_price: item.product.salesperson_discounted_price,
      dnd_discounted_price: item.product.dnd_discounted_price,
      original_price: item.product.price,
    });
    const itemTotal = price * item.quantity;

    const itemCoupon =
      totalAmount > 0 ? (itemTotal / totalAmount) * couponPrice : 0;
    const taxableAmount = itemTotal - itemCoupon;

    const cgst = Number(item.product.hsn_code?.cgst_rate) || 0;
    const sgst = Number(item.product.hsn_code?.sgst_rate) || 0;
    const igst = Number(item.product.hsn_code?.igst_rate) || 0;
    const cess = Number(item.product.hsn_code?.cess) || 0;
    console.log('PRICE', address?.state_code);
    console.log(cgst, sgst, igst, cess, 'TAX RATES');

    let tax = 0;
    if (address?.state_code === SELLER_STATE_CODE) {
      tax = taxableAmount * ((cgst + sgst) / 100);
    } else {
      tax = taxableAmount * (igst / 100);
    }

    console.log(tax, 'TAX');

    tax += taxableAmount * (cess / 100);

    totalTax += tax;
  });

  return totalTax.toFixed(2);
};
