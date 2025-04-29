import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import CartHeader from '../../components/CartHeader';
import CartItem from '../../components/CartItem';
import CartBillSummary from '../../components/CartBillSummary';
import CartPayableSection from '../../components/CartPayableSection';
import CartOfferSection from '../../components/CartOfferSection';
import EmptyCart from '../../components/EmptyCart';
import ProductGrid from '../../components/ProductGrid';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      title: 'FameMeds Paracetamol 500mg Tablets',
      description: 'Fast Pain Relief & Fever Reduction',
      price: 306,
      mrp: 529,
      discountPercentage: 42,
      quantity: 2,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: '2',
      title: 'FameMeds Paracetamol 500mg Tablets',
      description: 'Fast Pain Relief & Fever Reduction',
      price: 306,
      mrp: 529,
      discountPercentage: 42,
      quantity: 1,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: '3',
      title: 'FameMeds Paracetamol 500mg Tablets',
      description: 'Fast Pain Relief & Fever Reduction',
      price: 306,
      mrp: 529,
      discountPercentage: 42,
      quantity: 1,
      image: 'https://via.placeholder.com/100',
    },
  ]);

  const [activeTab, setActiveTab] = useState('cart');

  const products = [
    {
      id: '1',
      image: require('../../assets/protein-jar.png'),
      price: 259,
      originalPrice: 599,
      discount: '66%',
      title: 'Tropeaka Lean Protein Salted',
      subtitle: 'Icky Top Navigation With A Sear...',
    },
    {
      id: '2',
      image: require('../../assets/protein-jar.png'),
      price: 299,
      originalPrice: 699,
      discount: '57%',
      title: 'Tropeaka Vegan Protein Chocolate',
      subtitle: 'Delicious and Nutritious',
    },
    {
      id: '3',
      image: require('../../assets/protein-jar.png'),
      price: 349,
      originalPrice: 799,
      discount: '56%',
      title: 'Tropeaka Superfood Protein Vanilla',
      subtitle: 'Nutritious and Tasty',
    },
    {
      id: '4',
      image: require('../../assets/protein-jar.png'),
      price: 349,
      originalPrice: 799,
      discount: '56%',
      title: 'Tropeaka Superfood Protein Vanilla',
      subtitle: 'Nutritious and Tasty',
    },
  ];

  // Cart functions
  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setCartItems(
      cartItems.map(item =>
        item.id === itemId ? {...item, quantity: newQuantity} : item,
      ),
    );
  };

  const handlePlaceOrder = () => {
    console.log('Order placed!');
    // Implementation for placing order
  };

  const handleProductPress = (productId: string) => {
    console.log(`Product ${productId} pressed`);
    // Navigate to product detail
  };

  const handleApplyCoupon = () => {
    console.log('Apply coupon pressed');
    // Show coupon modal or navigate to coupon screen
  };

  const handleChangeAddress = () => {
    console.log('Change address pressed');
    // Navigate to address selection screen
  };

  const handleShopNow = () => {
    console.log('Shop now pressed');
    // Navigate to products screen
  };

  // Calculate bill
  const itemTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const platformFee = 4;
  const discount = 224;
  const shippingFee = 'As per delivery address';
  const totalAmount = itemTotal + platformFee - discount;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CartHeader
          deliverTo="Thane 1, Sector"
          onChangePress={handleChangeAddress}
        />

        {cartItems.length > 0 ? (
          <>
            {/* Cart Items */}
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={handleRemoveItem}
                onQuantityChange={handleQuantityChange}
              />
            ))}

            {/* Bill Summary */}
            <CartBillSummary
              itemTotal={itemTotal}
              platformFee={platformFee}
              discount={discount}
              shippingFee={shippingFee}
              totalAmount={totalAmount}
            />

            <CartOfferSection onApplyCoupon={handleApplyCoupon} />

            {/* Payable Amount & Order Button */}
            <CartPayableSection
              totalAmount={totalAmount}
              onPlaceOrder={handlePlaceOrder}
            />

            {/* Offers & Coupons */}

            <ProductGrid title="Items you may have missed" data={products} />

            <ProductGrid title="Recently Viewed" data={products} />
          </>
        ) : (
          <EmptyCart onShopNow={handleShopNow} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
