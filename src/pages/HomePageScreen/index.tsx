import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import GradientHeader from '../../components/GradientHeader';
import ImageCarousel from '../../components/ImageCarousel';
import ProductGrid from '../../components/ProductGrid';
import CustomCTA from '../../components/CTA';
import HealthConditionSection from '../../components/HealthCondition';
import TestimonialCard from '../../components/TestimonialCard';
import Blog from '../../components/Blog';
import {useCallback, useEffect, useState} from 'react';
import {fetchProducts} from '../../apis/fetchProducts';
import {useQuery} from '@tanstack/react-query';
import {selectCategories} from '../../redux/slice/categorySlice';
import {useAppSelector} from '../../redux/store';
import {selectServices} from '../../redux/slice/servicesSlice';

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

// const services = [
//   {
//     id: '1',
//     image: require('../../assets/service-img.png'),
//     price: 259,
//     originalPrice: 599,
//     discount: '66%',
//     title: 'Tropeaka Lean Protein Salted',
//     subtitle: 'Icky Top Navigation With A Sear...',
//   },
//   {
//     id: '2',
//     image: require('../../assets/service-img.png'),
//     price: 259,
//     originalPrice: 599,
//     discount: '66%',
//     title: 'Tropeaka Lean Protein Salted',
//     subtitle: 'Icky Top Navigation With A Sear...',
//   },
//   {
//     id: '3',
//     image: require('../../assets/service-img.png'),
//     price: 259,
//     originalPrice: 599,
//     discount: '66%',
//     title: 'Tropeaka Lean Protein Salted',
//     subtitle: 'Icky Top Navigation With A Sear...',
//   },
//   {
//     id: '4',
//     image: require('../../assets/service-img.png'),
//     price: 259,
//     originalPrice: 599,
//     discount: '66%',
//     title: 'Tropeaka Lean Protein Salted',
//     subtitle: 'Icky Top Navigation With A Sear...',
//   },
// ];

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

  console.log('services', services);
  console.log('categories', categories);

  const topProductsParams = {
    is_best_seller: true,
    page: 1,
    per_page: 10,
  };

  const bestSellerParams = {
    is_best_seller: true,
    page: 1,
    per_page: 10,
  };

  const mostOrderedMedicineParams = {
    is_best_seller: true,
    page: 1,
    per_page: 10,
  };

  const {data: topProducts, isLoading: isLoadingTopProducts} = useQuery({
    queryKey: ['top_products'],
    queryFn: async () => {
      const apiResponse = await fetchProducts({params: topProductsParams});
      if (apiResponse?.response?.success) {
        return apiResponse?.response?.data?.data;
      }
      return [];
    },
  });

  const {data: superSellingProducts, isLoading: isLoadingSuperSellingProducts} =
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

  return (
    <ScrollView style={styles.container}>
      <GradientHeader title="" description="" isHomePage />
      <ImageCarousel />
      <ProductGrid
        title="Our Best Products"
        highlight={{live: true}}
        rows={2}
        data={topProducts}
      />
      <CustomCTA
        leftImage={require('../../assets/left-cta-img.png')}
        text="Save unto 10% extra enjoy FREE delivery with PLUS membership"
        highlight={{'10%': true, free: true, plus: true, membership: true}}
        buttonText="Buy Now"
        onPress={() => console.log('CTA clicked!')}
      />

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

      <Image
        source={require('../../assets/healthBanner.png')}
        style={styles.healthBanner}
      />
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
          {testimonialsData.map(testimonial => (
            <TestimonialCard
              key={testimonial.id}
              name={testimonial.name}
              testimonial={testimonial.testimonial}
              image={testimonial.image}
              isHomePage
            />
          ))}
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
    width: '100%',
    resizeMode: 'cover',
    marginVertical: 10,
  },
});
