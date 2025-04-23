import {View, Text, StyleSheet, ScrollView} from 'react-native';
import GradientHeader from '../../components/GradientHeader';
import ImageCarousel from '../../components/ImageCarousel';
import ProductGrid from '../../components/ProductGrid';
import CustomCTA from '../../components/CTA';
import HealthConditionSection from '../../components/HealthCondition';
import TestimonialCard from '../../components/TestimonialCard';
import Blog from '../../components/Blog';

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

const services = [
  {
    id: '1',
    image: require('../../assets/service-img.png'),
    price: 259,
    originalPrice: 599,
    discount: '66%',
    title: 'Tropeaka Lean Protein Salted',
    subtitle: 'Icky Top Navigation With A Sear...',
  },
  {
    id: '2',
    image: require('../../assets/service-img.png'),
    price: 259,
    originalPrice: 599,
    discount: '66%',
    title: 'Tropeaka Lean Protein Salted',
    subtitle: 'Icky Top Navigation With A Sear...',
  },
  {
    id: '3',
    image: require('../../assets/service-img.png'),
    price: 259,
    originalPrice: 599,
    discount: '66%',
    title: 'Tropeaka Lean Protein Salted',
    subtitle: 'Icky Top Navigation With A Sear...',
  },
  {
    id: '4',
    image: require('../../assets/service-img.png'),
    price: 259,
    originalPrice: 599,
    discount: '66%',
    title: 'Tropeaka Lean Protein Salted',
    subtitle: 'Icky Top Navigation With A Sear...',
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

const index = () => {
  return (
    <ScrollView style={styles.container}>
      <GradientHeader title="" description="" isHomePage />
      <ImageCarousel /> {/* Add the Slider component here */}
      <ProductGrid title='Sale is Live' highlight={{'live': true}} rows={2} data={products} />
      <CustomCTA
        leftImage={require('../../assets/left-cta-img.png')}
        text="Save unto 10% extra enjoy FREE delivery with PLUS membership"
        highlight={{'10%': true, free: true, plus: true, membership: true}}
        buttonText="Buy Now"
        onPress={() => console.log('CTA clicked!')}
      />
      <ProductGrid title='Our Laundry Services' highlight={{'laundry': true}} data={services} />
      <ProductGrid title='Our House Cleaning Services' highlight={{'cleaning': true}} data={services} />
      <HealthConditionSection />
      <ProductGrid title='Top Picks For You' highlight={{'picks': true}} data={products} />
      <ProductGrid title='Big Deals On Sports Drinks' highlight={{'sports': true, 'drinks': true}} data={services} />
      <ProductGrid title='Shop By Catergories' highlight={{'catergories': true}} data={services} />
      <ProductGrid title='Best Services for You' highlight={{'you': true}} data={services} />
      <Blog />
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
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  testimonialContainer: {
    padding: 10,
    marginVertical: 20,
  },
});
