import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import GradientHeader from '../../components/GradientHeader/index';
import BookingForm from '../../components/BookingForm/index';
import AboutUs from '../../components/AboutUsSection/index';
import TestimonialCard from '../../components/TestimonialCard';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../utils/api/apiService';
import { endpoints } from '../../utils/endpoints';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { fetchCategories, selectCategories } from '../../redux/slice/categorySlice';
import { useEffect } from 'react';

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

const index = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);

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
  return (
      <ScrollView>
        <GradientHeader
          title="Get Your Laundry Done!"
          description="Visit, call, or drop us a message—we’re just around the corner!"
        />
        <BookingForm title="Request Pickup" categories={categories} />
        <AboutUs
          title="We care for your Clothes"
          description={internalPageConfig?.aboutDescription}
          buttonText="Book Now"
          imageSource={internalPageConfig?.aboutUsImage}
        />
        {/* A weird design component that need to be redesigned from figma */}

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
});
