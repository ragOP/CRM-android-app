import React from 'react';
import {View, ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import ProductImages from '../../components/ProductImages';
import ProductPricing from '../../components/ProductPricing';
import ProductVariants from '../../components/ProductVariants';
import ProductDosage from '../../components/ProductDosage';
import SimilarProducts from '../../components/SimilarProducts';
import ProductDetails from '../../components/ProductDetails';
import AddToCartBar from '../../components/AddToCartBar';
import DottedHorizontalRule from '../DottedHorizontalRule';
import {calculateDiscountPercentage} from '../../utils/percentage/calculateDiscountPercentage';
import {getDiscountBasedOnRole} from '../../utils/products/getDiscountBasedOnRole';
import {useAppSelector} from '../../redux/store';

export type ProductType = {
  _id: string;
  name: string;
  small_description: string;
  full_description: string;
  price: number;
  discounted_price: number;
  salesperson_discounted_price: number;
  dnd_discounted_price: number;
  instock: boolean;
  manufacturer: string;
  consumed_type: string;
  banner_image: string;
  images: string[];
  expiry_date: string | null;
  meta_data: Record<string, any>;
  uploaded_by_brand: string;
  is_best_seller: boolean;
  category: string[];
  created_by_admin: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type ProductPageProps = {
  product: ProductType;
  similarProducts?: ProductType[];
  onAddToCart: () => void;
};

const ProductPage = ({
  product,
  similarProducts = [],
  onAddToCart,
}: ProductPageProps) => {
  const reduxAuth = useAppSelector(state => state.auth);
  const reduxUser = reduxAuth.user;
  const reduxUserRole = reduxUser?.role || 'user';

  const discountPrice = getDiscountBasedOnRole({
    role: reduxUserRole,
    discounted_price: product.discounted_price,
    original_price: product.price,
    salesperson_discounted_price: product.salesperson_discounted_price,
    dnd_discounted_price: product.dnd_discounted_price,
  });

  const discountPercentage = calculateDiscountPercentage(
    product.price,
    discountPrice,
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ProductImages images={product.images} />
          <ProductPricing
            mrp={product.price}
            discountPrice={discountPrice}
            discountPercent={discountPercentage}
            // specialOffer={product.specialOffer}
            highlight={{'50%': true, off: true, free: true}}
            productName={product.name}
            productDescription={product.small_description}
          />
          <View style={styles.content}>
            <ProductVariants variants={product?.variants || []} />
            <DottedHorizontalRule
              dotSize={4}
              dotColor="#4D4D4D"
              spacing={5}
              thickness={1}
            />
            {product?.dosage && (
              <ProductDosage
                dosage={{
                  timing: ['Before Breakfast', 'After Lunch', 'After Dinner'],
                  time: ['09:00 AM', '02:02 PM', '09:08 PM'],
                }}
              />
            )}
            <SimilarProducts products={similarProducts} />
            <ProductDetails
              description={product.full_description}
              features={product.features}
              directions={product.directions}
              faqs={product.faqs}
            />
          </View>
        </ScrollView>

        {/* Fixed button bar at the bottom */}
        <View style={styles.fixedButtonContainer}>
          <AddToCartBar onAddToCart={onAddToCart} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const bottomBarHeight = 50;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  mainContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    paddingBottom: bottomBarHeight,
  },
  content: {
    padding: 15,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    elevation: 8, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default ProductPage;
