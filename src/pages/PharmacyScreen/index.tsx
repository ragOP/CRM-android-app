import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import GradientHeader from '../../components/GradientHeader';
import GradientSearchHeader from '../../components/GradientSearchHeader';
import ProductGrid from '../../components/ProductGrid';
import HealthConditionSection from '../../components/HealthCondition';
import CustomCTA from '../../components/CTA';
import Blog from '../../components/Blog';

const sportDrinkData = [
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
  {
    id: '5',
    image: require('../../assets/protein-jar.png'),
    price: 399,
    originalPrice: 899,
    discount: '56%',
    title: 'Tropeaka Superfood Protein Chocolate',
    subtitle: 'Delicious and Nutritious',
  },
  {
    id: '6',
    image: require('../../assets/protein-jar.png'),
    price: 450,
    originalPrice: 999,
    discount: '55%',
    title: 'Tropeaka Premium Protein Blend',
    subtitle: 'Ultimate Nutrition for Athletes',
  },
];

const categories = [
  {
    id: '1',
    image: require('../../assets/medicine.png'),
    title: 'Medicines',
    discount: 'SAVE 20 % OFF',
  },
  {
    id: '2',
    image: require('../../assets/medicine.png'),
    title: 'Medicines',
    discount: 'SAVE 20 % OFF',
  },
  {
    id: '3',
    image: require('../../assets/medicine.png'),
    title: 'Medicines',
    discount: 'SAVE 20 % OFF',
  },
  {
    id: '4',
    image: require('../../assets/medicine.png'),
    title: 'Medicines',
    discount: 'SAVE 20 % OFF',
  },
];

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
  {
    id: '5',
    image: require('../../assets/protein-jar.png'),
    price: 399,
    originalPrice: 899,
    discount: '56%',
    title: 'Tropeaka Superfood Protein Chocolate',
    subtitle: 'Delicious and Nutritious',
  },
  {
    id: '6',
    image: require('../../assets/protein-jar.png'),
    price: 450,
    originalPrice: 999,
    discount: '55%',
    title: 'Tropeaka Premium Protein Blend',
    subtitle: 'Ultimate Nutrition for Athletes',
  },
];

const PharmacyScreen = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{flex: 1, backgroundColor: 'white'}}>
      <GradientSearchHeader />
      <ProductGrid
        title="Big Deals On Sports Drinks"
        highlight={{sports: true, drinks: true}}
        data={sportDrinkData}
      />
      <HealthConditionSection />
      <Image
        source={require('../../assets/healthBanner.png')}
        style={styles.healthBanner}
      />
      <ProductGrid
        title="Shop By Categories"
        highlight={{categories: true}}
        data={categories}
        isCategory
        rows={2}
      />

      {/* <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 100,
        }}>
        <Image
          source={require('../../assets/insuranceBanner.png')}
          style={{
            width: '50%',
            height: '100%',
            position: 'absolute',
            left: -10,
          }}
        />
        <Image
          source={require('../../assets/insuranceBanner.png')}
          style={{
            width: '50%',
            height: '100%',
            position: 'absolute',
            right: -10,
          }}
        />
      </View>

      <ProductGrid
        title="Top Picks For You"
        highlight={{picks: true}}
        data={products}
      />
      <CustomCTA
        leftImage={require('../../assets/left-cta-img.png')}
        text="Save unto 10% extra enjoy FREE delivery with PLUS membership"
        highlight={{'10%': true, free: true, plus: true, membership: true}}
        buttonText="Buy Now"
        onPress={() => console.log('CTA clicked!')}
      />

      <ProductGrid
        title="Sale is Live"
        highlight={{live: true}}
        rows={2}
        data={products}
      />
      <ProductGrid
        title="Big Deals On Sports Drinks"
        highlight={{sports: true, drinks: true}}
        data={sportDrinkData}
      />
      <Blog /> */}
    </ScrollView>
  );
};

export default PharmacyScreen;

const styles = StyleSheet.create({
  healthBanner: {
    width: '100%',
    resizeMode: 'cover',
    marginVertical: 10,
  },
});
