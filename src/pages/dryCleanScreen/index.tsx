import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import GradientHeader from '../../components/GradientHeader/index';
import BookingForm from '../../components/BookingForm/BookingForm';
import ProductGrid from '../../components/ProductGrid';
import Blog from '../../components/Blog';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../utils/api/apiService';
import { endpoints } from '../../utils/endpoints';

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

const index: React.FC = () => {
    const {data: internalPageConfig} = useQuery({
    queryKey: ['internal_config'],
    queryFn: async () => {
      const apiResponse = await apiService({
        endpoint: endpoints.internal_page,
        method: 'GET',
      });
      if (apiResponse?.response?.success) {
        return apiResponse?.response?.data;
      }
      return {};
    },
  });
  return (
    <ScrollView>
      <GradientHeader
        title="Trusted Service, Right at Your Doorstep."
        description="Visit, call, or drop us a message—we’re just around the corner!"
      />
      <BookingForm title="Request Pickup" isLaundry />
      <ProductGrid
        title="Top Picks for You"
        highlight={{picks: true}}
        data={products}
      />
      {internalPageConfig?.flyer1 && (
        <Image
          source={{uri: internalPageConfig?.flyer1}}
          style={styles.healthBanner}
        />
      )}

      <ProductGrid title="Best Services" data={products} />

      <View
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
      <Blog />
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({
  healthBanner: {
    width: '100%',
    resizeMode: 'cover',
    marginVertical: 10,
  },
});
