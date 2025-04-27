import React from 'react';
import {View, ScrollView, StyleSheet, SafeAreaView, Dimensions} from 'react-native';
import ProductImages from '../../components/ProductImages';
import ProductPricing from '../../components/ProductPricing';
import ProductVariants from '../../components/ProductVariants';
import ProductDosage from '../../components/ProductDosage';
import SimilarProducts from '../../components/SimilarProducts';
import ProductDetails from '../../components/ProductDetails';
import AddToCartBar from '../../components/AddToCartBar';
import DottedHorizontalRule from '../DottedHorizontalRule';

interface ProductPageProps {
  product: {
    id: string;
    name: string;
    shortDescription: string;
    images: string[];
    mrp: number;
    discountPrice: number;
    discountPercent?: number;
    specialOffer?: string;
    variants: {
      weight: string;
      price: number;
      pricePerGram: string;
      inStock: boolean;
    }[];
    dosage?: {
      timing: string[];
      time: string[];
    };
    description: string;
    features: string[];
    directions: string[];
    faqs?: {question: string; answer: string}[];
  };
  similarProducts: {
    id: string;
    name: string;
    image: string;
    price: number;
    mrp: number;
    discountPercent?: number;
  }[];
}

const ProductPage: React.FC<ProductPageProps> = ({
  product,
  similarProducts,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ProductImages images={product.images} />
          <ProductPricing
            mrp={product.mrp}
            discountPrice={product.discountPrice}
            discountPercent={product.discountPercent}
            specialOffer={product.specialOffer}
            highlight={{'50%': true, off: true, free: true}}
            productName={product.name}
            productDescription={product.shortDescription}
          />
          <View style={styles.content}>
            <ProductVariants variants={product.variants} />
            <DottedHorizontalRule
              dotSize={4}
              dotColor="#4D4D4D"
              spacing={5}
              thickness={1}
            />
            {product.dosage && (
              <ProductDosage
                dosage={{
                  timing: ['Before Breakfast', 'After Lunch', 'After Dinner'],
                  time: ['09:00 AM', '02:02 PM', '09:08 PM'],
                }}
              />
            )}
            <SimilarProducts products={similarProducts} />
            <ProductDetails
              description={product.description}
              features={product.features}
              directions={product.directions}
              faqs={product.faqs}
            />
          </View>
        </ScrollView>
        
        {/* Fixed button bar at the bottom */}
        <View style={styles.fixedButtonContainer}>
          <AddToCartBar />
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
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  }
});

export default ProductPage;