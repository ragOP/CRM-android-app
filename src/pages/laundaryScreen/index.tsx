import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ToastAndroid
} from 'react-native';
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
import {useEffect, useState, useRef, use} from 'react';
import {fetchProducts} from '../../apis/fetchProducts';
import LaundryServiceCard from '../../components/LaundryServiceCard';
import { getItem } from '../../utils/local_storage';

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

const index = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const [laundryProducts, setLaundryProducts] = useState<LaundryProduct[]>([]);
  const laundryRef = useRef(null);

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

  const queryClient = useQueryClient();
  const { mutate: addToCartMutate, isPending } = useMutation({
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
      ToastAndroid.show('Product added to cart', ToastAndroid.SHORT);
      queryClient.invalidateQueries({ queryKey: ["cart_products"] });
    }
  });

  const handleAddToCart = (product_id: string) => {
    addToCartMutate(product_id);
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
      console.log(
        'Products fetched successfully:',
        apiResponse?.response?.data?.data,
      );
    } else {
      console.log('Failed to fetch products:', apiResponse);
      setLaundryProducts([]);
    }
  };

  return (
    <ScrollView>
      <GradientHeader
        title="Get Your Laundry Done!"
        description="Visit, call, or drop us a message—we’re just around the corner!"
      />

      <BookingForm title="Request Pickup" categories={categories} onClick={handleAddToCart} isPending={isPending} />

      <OurServices categories={categories} onPress={fetchLaundryProducts} />
      
      <AboutUs
        title="We care for your Clothes"
        description={internalPageConfig?.aboutDescription}
        buttonText="Book Now"
        imageSource={internalPageConfig?.aboutUsImage}
      />
      {/* A weird design component that need to be redesigned from figma */}

      <View style={styles.productsContainer} ref={laundryRef}>
        <Text style={styles.productsTitle}>Available Products</Text>
        <ScrollView
          style={styles.container}>
          {laundryProducts.map((service, serviceIndex) => (
            <LaundryServiceCard
              key={service._id}
              service_id={service._id}
              serviceType={service.name}
              price={service.price}
              originalPrice={service.discounted_price}
              description={service.small_description}
              features={serviceIndex === 0 ? service.full_description.split('✔') : service.full_description.split('✔')}
              serviceIndex={serviceIndex}
              handleAddToCart={handleAddToCart}
              isPending={isPending}
            />
          ))}
        </ScrollView>
      </View>

      {/* Testimonial */}
      <View style={styles.testimonialContainer}>
        <Text style={{color: '#04050B', fontSize: 14, fontWeight: 'bold'}}>
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

export default index;

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
  container: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 280,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 13,
    color: '#444',
    marginBottom: 10,
  },
  featureList: {
    marginVertical: 10,
  },
  feature: {
    fontSize: 13,
    marginBottom: 5,
    color: '#333',
  },
  button: {
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 24,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});
