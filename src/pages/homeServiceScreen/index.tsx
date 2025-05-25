import {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import GradientHeader from '../../components/GradientHeader';
import BookingForm from '../../components/BookingForm/BookingForm';
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
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {endpoints} from '../../utils/endpoints';
import {apiService} from '../../utils/api/apiService';
import {fetchProducts} from '../../apis/fetchProducts';
import HouseCleaningProductCard from '../../components/HouseCleaningProductCard';
import {getItem} from '../../utils/local_storage';
import TestimonialCard from '../../components/TestimonialCard';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomDialog from '../../components/CustomDialog/CustomDialog';
import {showSnackbar} from '../../redux/slice/snackbarSlice';
import {fetchTestimonials} from '../../apis/fetchTestimonials';

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

const testimonialsData = [
  {
    id: '1',
    name: 'Rajesh Gupta',
    testimonial:
      "I have tried several laundry services, but none compare to the exceptional quality and promptness I've experienced with Washmart. Their attention to detail and efficient delivery of clean and fresh clothes are remarkable.",
    image: require('../../assets/testimonialImage.png'),
  },
  {
    id: '2',
    name: 'Rajesh Gupta',
    testimonial:
      "I have tried several laundry services, but none compare to the exceptional quality and promptness I've experienced with Washmart. Their attention to detail and efficient delivery of clean and fresh clothes are remarkable.",
    image: require('../../assets/testimonialImage.png'),
  },
  {
    id: '3',
    name: 'Rajesh Gupta',
    testimonial:
      "I have tried several laundry services, but none compare to the exceptional quality and promptness I've experienced with Washmart. Their attention to detail and efficient delivery of clean and fresh clothes are remarkable.",
    image: require('../../assets/testimonialImage.png'),
  },
  {
    id: '4',
    name: 'Rajesh Gupta',
    testimonial:
      "I have tried several laundry services, but none compare to the exceptional quality and promptness I've experienced with Washmart. Their attention to detail and efficient delivery of clean and fresh clothes are remarkable.",
    image: require('../../assets/testimonialImage.png'),
  },
];

interface HouseCleaningProducts {
  _id: string;
  name: string;
  small_description: string;
  banner_image: string;
  price: number;
  discounted_price: number;
}

const HomeServingProduct = ({
  isLoading,
  houseCleaningProducts,
  handleAddToCart,
  isPending,
  setHouseCleaningOffsetY,
}) => {
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
    <View
      onLayout={event => {
        setHouseCleaningOffsetY(event.nativeEvent.layout.y);
      }}
      style={styles.productsContainer}>
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
            onPress={handleAddToCart}
            isPending={isPending}
          />
        )}
        keyExtractor={item => item._id}
      />
    </View>
  );
};

const HouseServiceScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const houseCleaningRef = useRef<FlatList>(null);
  const route = useRoute();

  const {service} = route.params || {};

  const categories = useAppSelector(selectCategories);
  const reduxUserId = useAppSelector(state => state.auth.user?.id);
  const isLoggedIn = useAppSelector(state => state.auth.token);

  const [houseCleaningProducts, setHouseCleaningProducts] = useState<
    HouseCleaningProducts[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [houseCleaningOffsetY, setHouseCleaningOffsetY] = useState<number>(0);

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

  const {data: testimonialsRes, isLoading: isLoadingTestimonials} = useQuery({
    queryKey: ['testimonialsRes'],
    queryFn: fetchTestimonials,
  });

  const scrollToProductsSection = () => {
    if (houseCleaningRef.current && houseCleaningOffsetY !== null) {
      houseCleaningRef.current.scrollToOffset({
        offset: houseCleaningOffsetY,
        animated: true,
      });
    }
  };
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
        setHouseCleaningProducts(apiResponse?.response?.data?.data);
        scrollToProductsSection();
      } else {
        setHouseCleaningProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setHouseCleaningProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const {mutate: addToCartMutate, isPending} = useMutation({
    mutationFn: async (product_id: string) => {
      const userData = await getItem('userData');

      const payload = {
        product_id,
        quantity: 1,
        user_id: userData.userId,
      };

      const apiResponse = await apiService({
        endpoint: endpoints.cart,
        method: 'POST',
        data: payload,
        token: userData.token,
      });

      return apiResponse;
    },
    onSuccess: () => {
      dispatch(
        showSnackbar({
          type: 'success',
          title: 'Product added to cart successfully!',
          placement: 'top',
        }),
      );
      queryClient.invalidateQueries({queryKey: ['cart_products']});
    },
  });

  const onLoginRedirect = async () => {
    const productData = {
      product_id: selectedProductId,
      quantity: 1,
    };

    const dataToSave = {
      product: productData,
      timestamp: Date.now(),
    };

    await AsyncStorage.setItem('tempProduct', JSON.stringify(dataToSave));

    navigation.navigate('Account', {
      screen: 'LoginScreen',
    });
  };

  const handleAddToCart = (product_id: string) => {
    if (isLoggedIn) {
      addToCartMutate(product_id);
    } else {
      setShowLoginDialog(true);
      setSelectedProductId(product_id);
    }
  };

  useEffect(() => {
    dispatch(fetchCategories({service_id: service?._id}));
  }, [dispatch]);

  return (
    <>
      <FlatList
        ref={houseCleaningRef}
        ListHeaderComponent={
          <>
            <GradientHeader
              title="Home Cleaning"
              description="Professional home cleaning services tailored to your needs. Book today
                  for a fresher, healthier home."
            />
            <BookingForm
              title="Let's Make Your Home Sparkle – Contact Us!"
              categories={categories}
              onClick={handleAddToCart}
              isPending={isPending}
            />

            <OurServices
              categories={categories}
              onPress={fetchHouseCleaningProducts}
            />

            <AboutUs
              title="About Us"
              description={internalPageConfig?.aboutDescription}
              buttonText="Book Now"
              imageSource={internalPageConfig?.aboutUsImage}
            />

            <HomeServingProduct
              isLoading={isLoading}
              houseCleaningProducts={houseCleaningProducts}
              handleAddToCart={handleAddToCart}
              isPending={isPending}
              setHouseCleaningOffsetY={setHouseCleaningOffsetY}
            />

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

              {/* Testimonial */}
              <View style={styles.testimonialContainer}>
                <Text
                  style={{color: '#00008B', fontSize: 20, fontWeight: 'bold'}}>
                  Our clients praise us for great service.
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {isLoadingTestimonials ? (
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <ActivityIndicator color="#00008B" />
                    </View>
                  ) : (
                    testimonialsRes.map(testimonial => (
                      <TestimonialCard
                        key={testimonial._id}
                        name={testimonial.customer_name}
                        testimonial={testimonial.message}
                        image={testimonial.image}
                        isHomePage
                      />
                    ))
                  )}
                </ScrollView>
              </View>
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

      <CustomDialog
        visible={showLoginDialog}
        title="Login Required"
        message="You need to log in to add products to the cart."
        primaryLabel="Login"
        primaryAction={() => {
          setShowLoginDialog(false);
          onLoginRedirect();
        }}
        secondaryLabel="Cancel"
        secondaryAction={() => setShowLoginDialog(false)}
        onDismiss={() => setShowLoginDialog(false)}
      />
    </>
  );
};

export default HouseServiceScreen;

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
    marginLeft: 10,
  },
  testimonialContainer: {
    padding: 10,
    marginVertical: 20,
  },
});
