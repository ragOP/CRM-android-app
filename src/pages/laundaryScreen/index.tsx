import {View, Text, ScrollView, StyleSheet, Alert} from 'react-native';
import GradientHeader from '../../components/GradientHeader/index';
import BookingForm from '../../components/BookingForm/index';
import AboutUs from '../../components/AboutUsSection/index';
import TestimonialCard from '../../components/TestimonialCard';
import OurServices from '../../components/OurServices';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {apiService} from '../../utils/api/apiService';
import {endpoints} from '../../utils/endpoints';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  fetchCategories,
  selectCategories,
} from '../../redux/slice/categorySlice';
import {useEffect, useState, useRef} from 'react';
import {fetchProducts} from '../../apis/fetchProducts';
import LaundryServiceCard from '../../components/LaundryServiceCard';
import {getItem} from '../../utils/local_storage';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

interface LaundryProduct {
  _id: string;
  name: string;
  small_description: string;
  full_description: string;
  banner_image: string;
  price: number;
  discounted_price: number;
}

const LaundaryScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const reduxUserId = useAppSelector(state => state.auth.user?.id);

  const categories = useAppSelector(selectCategories);
  const isLoggedIn = useAppSelector(state => state.auth.token);

  const scrollViewRef = useRef<ScrollView>(null);
  const [laundryProducts, setLaundryProducts] = useState<LaundryProduct[]>([]);
  const [laundryOffsetY, setLaundryOffsetY] = useState(0);

  const queryClient = useQueryClient();

  useEffect(() => {
    dispatch(fetchCategories({service_id: '67bb85be42d073bcb30015d9'}));
  }, []);

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

  const {mutate: addToCartMutate, isPending} = useMutation({
    mutationFn: async (product_id: string) => {

      const payload = {
        product_id,
        quantity: 1,
        user_id: reduxUserId,
      };

      const apiResponse = await apiService({
        endpoint: endpoints.cart,
        method: 'POST',
        data: payload,
      });

      return apiResponse;
    },
    onSuccess: () => {
      Alert.alert('Success', 'Product added to cart successfully!');
      queryClient.invalidateQueries({queryKey: ['cart_products']});
    },

    onError: () => {
      Alert.alert('Error', 'Failed to add product to cart. Please try again.');
    },
  });

  const scrollToLaundrySection = () => {
    scrollViewRef.current?.scrollTo({y: laundryOffsetY, animated: true});
  };

  const onLoginRedirect = async productId => {
    const productData = {
      product_id: productId,
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

  const handleAddToCart = (productId: string) => {
    if (isLoggedIn) {
      addToCartMutate(productId);
    } else {
      Alert.alert(
        'User not logged in',
        'You need to be logged in to add to cart',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'Login', onPress: () => onLoginRedirect(productId)},
        ],
      );
    }
  };

  const fetchLaundryProducts = async (id: string) => {
    const houseCleaningProductParams = {
      category_id: id,
    };
    const apiResponse = await fetchProducts({
      params: houseCleaningProductParams,
    });

    if (apiResponse?.response?.success) {
      setLaundryProducts(apiResponse?.response?.data?.data || []);
      scrollToLaundrySection();
    } else {
      console.log('Failed to fetch products:', apiResponse);
      setLaundryProducts([]);
    }
  };

  return (
    <ScrollView ref={scrollViewRef}>
      <GradientHeader
        title="Get Your Laundry Done!"
        description="Visit, call, or drop us a message—we’re just around the corner!"
      />

      <BookingForm
        title="Request Pickup"
        categories={categories}
        onClick={handleAddToCart}
        isPending={isPending}
      />

      <OurServices categories={categories} onPress={fetchLaundryProducts} />

      <AboutUs
        title="We care for your Clothes"
        description={internalPageConfig?.aboutDescription}
        buttonText="Book Now"
        imageSource={internalPageConfig?.aboutUsImage}
      />
      {/* A weird design component that need to be redesigned from figma */}

      <View
        style={styles.productsContainer}
        onLayout={event => {
          setLaundryOffsetY(event.nativeEvent.layout.y);
        }}>
        <Text style={styles.productsTitle}>Available Products</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.container}>
          {laundryProducts.length > 0 ? (
            laundryProducts.map((product, serviceIndex) => (
              <LaundryServiceCard
                key={product._id}
                productId={product._id}
                productType={product.name}
                price={product.price}
                originalPrice={product.discounted_price}
                description={product.small_description}
                features={
                  serviceIndex === 0
                    ? product.full_description.split('✔')
                    : product.full_description.split('✔')
                }
                serviceIndex={serviceIndex}
                handleAddToCart={handleAddToCart}
                isPending={isPending}
              />
            ))
          ) : (
            <View style={styles.noProductsContainer}>
              <Text style={styles.noProductsText}>
                No products available at the moment.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Testimonial */}
      <View style={styles.testimonialContainer}>
        <Text
          style={{
            color: '#04050B',
            fontSize: 18,
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: 10,
          }}>
          Our clients praise us for great service.
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {testimonialsData.map(testimonial => (
            <TestimonialCard
              key={testimonial.id}
              name={testimonial.name}
              testimonial={testimonial.testimonial}
              image={testimonial.image}
            />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default LaundaryScreen;

const styles = StyleSheet.create({
  testimonialContainer: {
    padding: 10,
    marginVertical: 20,
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
  container: {
    paddingHorizontal: 10,
  },
});
