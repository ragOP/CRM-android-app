import {useEffect, useState, useRef} from 'react';
import {View, Text, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import GradientHeader from '../../components/GradientHeader';
import BookingForm from '../../components/BookingForm';
import OurServices from '../../components/OurServices';
import PricingCard from '../../components/PricingCard';
import AboutUs from '../../components/AboutUsSection';
import HouseCleaningProducts from '../../components/HouseCleaningProducts';
import {useAppSelector} from '../../redux/store';
import {useAppDispatch} from '../../redux/store';
import {
  selectCategories,
  fetchCategories,
} from '../../redux/slice/categorySlice';
import {useQuery} from '@tanstack/react-query';
import {endpoints} from '../../utils/endpoints';
import {apiService} from '../../utils/api/apiService';
import {fetchProducts} from '../../apis/fetchProducts';
import HouseCleaningProductCard from '../../components/HouseCleaningProductCard';

const ourServices = [
  'Home Deep Cleaning',
  'Kitchen & Bathroom Cleaning',
  'Sofa & Carpet Cleaning',
  'Office & Commercial Cleaning',
  'Marble Polishing & Floor Care',
  'Pest Control & Sanitization',
  'Bird Netting & Disinfection',
  'Car Cleaning & Swimming Pool Cleaning',
];

const whyChooseUs = [
  'Experienced, friendly, and professional technicians.',
  'Advanced cleaning technology for thorough, hygienic results.',
  'Flexible booking slots—available anytime.',
  'Focus on health by minimizing dust, allergens, and infections.',
];

const pricingData = [
  {
    title: 'Home Cleaning',
    type: 'Studio Apartment (Upto 400 Sqft) -₹2500/-*',
    price: '₹2500',
    billingPeriod: 'per user/month, billed annually',
    features: Array(5).fill('1 BHK (401 to 600 Sqft) - ₹3800/- *'),
    buttonText: 'Book Now',
    highlight: false,
  },
  {
    title: 'Home Cleaning',
    type: 'Studio Apartment (Upto 400 Sqft) -₹2500/-*',
    price: '₹2500',
    billingPeriod: 'per user/month, billed annually',
    features: Array(5).fill('1 BHK (401 to 600 Sqft) - ₹3800/- *'),
    buttonText: 'Book Now',
    highlight: true,
  },
  {
    title: 'Home Cleaning',
    type: 'Studio Apartment (Upto 400 Sqft) -₹2500/-*',
    price: '₹2500',
    billingPeriod: 'per user/month, billed annually',
    features: Array(5).fill('1 BHK (401 to 600 Sqft) - ₹3800/- *'),
    buttonText: 'Book Now',
    highlight: false,
  },
];

const Index = () => {
  const [houseCleaningProducts, setHouseCleaningProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const houseCleaningRef = useRef(null);  
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);

  useEffect(() => {
    dispatch(fetchCategories({service_id: '67bb851a42d073bcb30015ca'}));
  }, [dispatch]);

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

  const fetchHouseCleaningProducts = async (id: string) => {
    setIsLoading(true);
    const houseCleaningProductParams = {
      category_id: id,
    };

    try {
      const apiResponse = await fetchProducts({
        params: houseCleaningProductParams,
      });
      
      if (apiResponse?.response?.success) {
        setHouseCleaningProducts(apiResponse?.response?.data);
        console.log('Products fetched successfully:', apiResponse?.response?.data);
      } else {
        console.log('Failed to fetch products:', apiResponse);
        setHouseCleaningProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setHouseCleaningProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render the products section
  const renderProductsSection = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      );
    }

    if (houseCleaningProducts.length === 0) {
      return (
        <View style={styles.noProductsContainer}>
          <Text style={styles.noProductsText}>No products available</Text>
        </View>
      );
    }

    return (
      <View style={styles.productsContainer} ref={houseCleaningRef}>
        <Text style={styles.productsTitle}>Available Products</Text>
        <FlatList
          data={houseCleaningProducts}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <HouseCleaningProductCard
              _id={item._id}
              name={item.name}
              small_description={item.small_description}
              discounted_price={item.discounted_price}
              price={item.price}
              banner_image={item.banner_image}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      </View>
    );
  };

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <GradientHeader
            title="Professional Home Cleaning Services"
            description="Professional home cleaning services tailored to your needs. Book today
                  for a fresher, healthier home."
          />
          <BookingForm
            title="Let's Make Your Home Sparkle – Contact Us!"
            categories={categories}
          />
          <OurServices categories={categories} onPress={fetchHouseCleaningProducts} />

          <AboutUs
            title="About Us"
            description={internalPageConfig?.aboutDescription}
            buttonText="Book Now"
            imageSource={internalPageConfig?.aboutUsImage}
          />

          {renderProductsSection()}

          {/* Our Services and Why Choose Us */}
          <View style={styles.middleContainer}>
            <LinearGradient
              colors={['#82C8E51A', '#00008B33']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.gradientContainer}>
              <View style={{marginBottom: 20}}>
                <Text style={styles.title}>Our Services</Text>
                <Text style={styles.midDescription}>
                  We provide a wide range of cleaning services, including:
                </Text>
                {ourServices.map((item, index) => (
                  <Text
                    key={`service-${index}`}
                    style={styles.listItem}>{`\u2022 ${item}`}</Text>
                ))}
              </View>

              <View style={{marginBottom: 20}}>
                <Text style={styles.title}>Why Choose Us?</Text>
                {whyChooseUs.map((item, index) => (
                  <Text
                    key={`why-${index}`}
                    style={styles.listItem}>{`\u2022 ${item}`}</Text>
                ))}
              </View>

              <View>
                <Text style={styles.title}>Serving Cities Across India</Text>
                <Text style={styles.midDescription}>
                  With our successful presence in Delhi NCR, we've expanded...
                </Text>
              </View>
            </LinearGradient>
          </View>
        </>
      }
      data={pricingData}
      renderItem={({item}) => (
        <PricingCard
          title={item.title}
          price={item.price}
          billingPeriod={item.billingPeriod}
          features={item.features}
          buttonText={item.buttonText}
          type={item.type}
          highlight={item.highlight}
        />
      )}
      keyExtractor={(item, index) => `pricing-${index}`}
    />
  );
};

export default Index;

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
  },
  midDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: '#333333',
  },
  middleContainer: {
    flex: 1,
    margin: 15,
  },
  gradientContainer: {
    width: '100%',
    borderRadius: 10,
    padding: 10,
  },
  listItem: {
    fontSize: 12,
    color: '#333333',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#0000ff',
  },
  noProductsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noProductsText: {
    fontSize: 16,
    color: '#666',
  },
  productsContainer: {
    margin: 10,
  },
  productsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
});