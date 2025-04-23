import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import GradientHeader from '../../components/GradientHeader/index';
import BookingForm from '../../components/BookingForm/index';
import AboutUs from '../../components/AboutUsSection/index';
import TestimonialCard from '../../components/TestimonialCard';

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
  return (
      <ScrollView>
        <GradientHeader
          title="Get Your Laundry Done!"
          description="Visit, call, or drop us a message—we’re just around the corner!"
        />
        <BookingForm title="Request Pickup" isLaundry={true} />
        <AboutUs
          title="We care for your Clothes"
          description={`We are your one-stop solution for all your laundry needs. Discover why Caresync is the best laundry service provider in India and why customers trust us for their laundry requirements. 
Whether you are a student or a busy professional living away from home, our laundry services promise to free up your time and deliver a clean, spotless set of clothes. We treat your laundry with great care.`}
          buttonText="Book Now"
          imageSource={require('../../assets/careForCloths.png')}
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
