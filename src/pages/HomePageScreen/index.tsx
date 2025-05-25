import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import GradientHeader from '../../components/GradientHeader';
import ImageCarousel from '../../components/ImageCarousel';
import ProductGrid from '../../components/ProductGrid';
import CustomCTA from '../../components/CTA';
import HealthConditionSection from '../../components/HealthCondition';
import TestimonialCard from '../../components/TestimonialCard';
import {fetchProducts} from '../../apis/fetchProducts';
import {fetchTestimonials} from '../../apis/fetchTestimonials';
import {useQuery} from '@tanstack/react-query';
import {selectCategories} from '../../redux/slice/categorySlice';
import {selectServices} from '../../redux/slice/servicesSlice';
import {useAppSelector} from '../../redux/store';
import {apiService} from '../../utils/api/apiService';
import {endpoints} from '../../utils/endpoints';
import { RefreshControl } from 'react-native';
import { useCallback, useState } from 'react';

// const testimonialsData = [
//   {
//     id: '1',
//     name: 'Rajesh Gupta',
//     testimonial:
//       "I have tried several laundry services, but none compare to the exceptional quality and promptness I've experienced with Washmart. Their attention to detail and efficient delivery of clean and fresh clothes are remarkable.",
//     image: require('../../assets/testimonialImage.png'),
//   },
//   {
//     id: '2',
//     name: 'Rajesh Gupta',
//     testimonial:
//       "I have tried several laundry services, but none compare to the exceptional quality and promptness I've experienced with Washmart. Their attention to detail and efficient delivery of clean and fresh clothes are remarkable.",
//     image: require('../../assets/testimonialImage.png'),
//   },
//   {
//     id: '3',
//     name: 'Rajesh Gupta',
//     testimonial:
//       "I have tried several laundry services, but none compare to the exceptional quality and promptness I've experienced with Washmart. Their attention to detail and efficient delivery of clean and fresh clothes are remarkable.",
//     image: require('../../assets/testimonialImage.png'),
//   },
//   {
//     id: '4',
//     name: 'Rajesh Gupta',
//     testimonial:
//       "I have tried several laundry services, but none compare to the exceptional quality and promptness I've experienced with Washmart. Their attention to detail and efficient delivery of clean and fresh clothes are remarkable.",
//     image: require('../../assets/testimonialImage.png'),
//   },
// ];

// const categories = [
//   {
//     id: '1',
//     image: require('../../assets/medicine.png'),
//     title: 'Medicines',
//     discount: 'SAVE 20 % OFF',
//   },
//   {
//     id: '2',
//     image: require('../../assets/medicine.png'),
//     title: 'Medicines',
//     discount: 'SAVE 20 % OFF',
//   },
//   {
//     id: '3',
//     image: require('../../assets/medicine.png'),
//     title: 'Medicines',
//     discount: 'SAVE 20 % OFF',
//   },
//   {
//     id: '4',
//     image: require('../../assets/medicine.png'),
//     title: 'Medicines',
//     discount: 'SAVE 20 % OFF',
//   },
// ];

const HomePageScreen = () => {
  const categories = useAppSelector(selectCategories);
  const services = useAppSelector(selectServices);
  const [refreshing, setRefreshing] = useState(false);

  const topProductsParams = {
    is_best_seller: true,
    page: 1,
    per_page: 10,
  };

  const bestSellerParams = {
    is_super_selling: true,
    page: 1,
    per_page: 10,
  };

  const mostOrderedMedicineParams = {
    is_most_ordered: true,
    page: 1,
    per_page: 10,
  };

  const {data: topProducts, isLoading: isLoadingTopProducts, refetch: refetchTopProducts} = useQuery({
    queryKey: ['top_products'],
    queryFn: async () => {
      const apiResponse = await fetchProducts({params: topProductsParams});
      if (apiResponse?.response?.success) {
        return apiResponse?.response?.data?.data;
      }
      return [];
    },
  });

  const {data: superSellingProducts, isLoading: isLoadingSuperSellingProducts,
  refetch: refetchSuperSellingProducts} =
    useQuery({
      queryKey: ['super_selling_products'],
      queryFn: async () => {
        const apiResponse = await fetchProducts({params: bestSellerParams});
        if (apiResponse?.response?.success) {
          return apiResponse?.response?.data?.data;
        }
        return [];
      },
    });

  const {
    data: mostOrderedMedicineProducts,
    isLoading: isLoadingMostOrderedMedicineProducts,
  refetch: refetchMostOrdered
  } = useQuery({
    queryKey: ['most_ordered_medicine_products'],
    queryFn: async () => {
      const apiResponse = await fetchProducts({
        params: mostOrderedMedicineParams,
      });
      if (apiResponse?.response?.success) {
        return apiResponse?.response?.data?.data;
      }
      return [];
    },
  });

  const {data: internalPageConfig, isLoading: isLoadingInternalPageConfig,
  refetch: refetchInternalConfig} = useQuery({
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

  const {data: testimonialsRes = [], isLoading: isLoadingTestimonials,
  refetch: refetchTestimonials} =
    useQuery({
      queryKey: ['testimonial'],
      queryFn: () => fetchTestimonials(),
      select: data => data?.data,
    });

    // Refresh handler
const onRefresh = useCallback(async () => {
  setRefreshing(true);
  await Promise.all([
    refetchTopProducts(),
    refetchSuperSellingProducts(),
    refetchMostOrdered(),
    refetchInternalConfig(),
    refetchTestimonials(),
  ]);
  setRefreshing(false);
}, []);

  // const [productsData, setProductsData] = useState({
  //   is_fetching: false,
  //   is_fetched: false,
  //   data: [],
  //   total: 0,
  //   params: {
  //     page: 1,
  //     limit: 10,
  //   },
  // });

  // const fetchAndSaveProducts = useCallback(async () => {
  //   try {
  //     setProductsData(prev => ({
  //       ...prev,
  //       is_fetching: true,
  //     }));

  //     const apiResponse = await fetchProducts({params: productsData.params});

  //     if (apiResponse?.response?.success) {
  //       const apiResponseData = apiResponse?.response?.data?.data;
  //       const total = apiResponse?.response?.data?.total;
  //       setProductsData(prev => ({
  //         ...prev,
  //         data: apiResponseData,
  //         total: total,
  //       }));
  //     }
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //   } finally {
  //     setProductsData(prev => ({
  //       ...prev,
  //       is_fetching: false,
  //       is_fetched: true,
  //     }));
  //   }
  // }, [productsData.params]);

  // useEffect(() => {
  //   if (!productsData.is_fetched) {
  //     fetchAndSaveProducts();
  //   }
  // }, [productsData.is_fetched, fetchAndSaveProducts]);

  // const productsList = productsData?.data || [];

  console.log("isLoadingInternalPageConfig", isLoadingInternalPageConfig);
  console.log('internalPageConfig', internalPageConfig?.flyer1);
  return (
    <ScrollView style={styles.container} refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }>
      <GradientHeader height={120} title="" description="" isHomePage={true} />
      <ImageCarousel />
      <ProductGrid
        title="Our Best Products"
        highlight={{live: true}}
        rows={2}
        data={topProducts}
      />
      {isLoadingInternalPageConfig ? (
        <View
          style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator color="#00008B" />
        </View>
      ): (
        <Image
          source={{uri: internalPageConfig.flyer1}}
          style={styles.healthBanner}
        />
        // <Text>hello</Text>
      )}
    
    {/* <Image
    key={6356642}
      source={{uri: "https://res.cloudinary.com/dacwig3xk/image/upload/v1741701739/uploads/images/jipgabltqov8ltww0wbt.png"}}
      style={styles.healthBanner}
      onError={(e) => console.log("Image load error:", e.nativeEvent)}
    /> */}

      {/* <CustomCTA
        leftImage={require('../../assets/left-cta-img.png')}
        text="Save unto 10% extra enjoy FREE delivery with PLUS membership"
        highlight={{'10%': true, free: true, plus: true, membership: true}}
        buttonText="Buy Now"
        onPress={() => console.log('CTA clicked!')}
      /> */}

      <ProductGrid
        title="Super Selling Services"
        highlight={{live: true}}
        rows={2}
        data={superSellingProducts}
      />

      {/* <ProductGrid
        title="Our Laundry Services"
        highlight={{laundry: true}}
        data={services}
      /> */}
      {/* <ProductGrid
        title="Our House Cleaning Services"
        highlight={{cleaning: true}}
        data={services}
      /> */}
      <HealthConditionSection />
      {/* <ProductGrid
        title="Top Picks For You"
        highlight={{picks: true}}
        data={products}
      /> */}

      <ProductGrid
        title="Most Ordered Medicine"
        highlight={{live: true}}
        rows={2}
        data={mostOrderedMedicineProducts}
      />

       {isLoadingInternalPageConfig ? (
        <View
          style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator color="#00008B" />
        </View>
      ): (
        internalPageConfig?.flyer1 && 
        <Image
          source={{uri: internalPageConfig?.flyer1}}
          style={styles.healthBanner}
        />
      )}
      {/* <ProductGrid
        title="Big Deals On Sports Drinks"
        highlight={{sports: true, drinks: true}}
        data={services}
      /> */}
      {/* <ProductGrid
        title="Shop By Categories"
        highlight={{categories: true}}
        data={categories}
        isCategory
        rows={2}
      /> */}
      {/* <ProductGrid
        title="Best Services for You"
        highlight={{you: true}}
        data={services}
      /> */}
      {/* <Blog /> */}
      {/* Testimonial */}
      <View style={styles.testimonialContainer}>
        <Text style={{color: '#00008B', fontSize: 20, fontWeight: 'bold'}}>
          Our clients praise us for great service.
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {isLoadingTestimonials ? (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator color="#00008B" />
            </View>
          ) : (
            Array.isArray(testimonialsRes) &&
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
    </ScrollView>
  );
};

export default HomePageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  testimonialContainer: {
    padding: 20,
  },
  healthBanner: {
    width: "100%",
    height: 100,
    resizeMode: 'contain',
  },
});
