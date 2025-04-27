import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import GradientHeader from '../../components/GradientHeader/index';
import BookingForm from '../../components/BookingForm/index';
import OurServices from '../../components/OurServices/index';
import PricingCard from '../../components/PricingCard/index';
import AboutUs from '../../components/AboutUsSection/index';

const index = () => {
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

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <GradientHeader
        title="Professional Home Cleaning Services"
        description="Professional home cleaning services tailored to your needs. Book today
                for a fresher, healthier home."
      />
      <BookingForm
        title="Let's Make Your Home Sparkle – Contact Us!"
        isLaundry={false}
      />
      <OurServices />

      {/* About Us Section */}
      <AboutUs
        title="About Us"
        description=" Care Sync is a leading professional cleaning company, known for
                  delivering high-quality services in Delhi NCR and beyond. We offer
                  comprehensive cleaning solutions for both residential and commercial
                  spaces. From deep cleaning to pest control, we ensure your space is
                  spotless, hygienic, and comfortable."
        buttonText="Book Now"
        imageSource={require('../../assets/aboutUs.png')}
      />

      {/* Our Services */}
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
            <FlatList
              data={ourServices}
              renderItem={({item}) => (
                <Text style={styles.listItem}>{`\u2022 ${item}`}</Text>
              )}
              keyExtractor={(item, index) => `service-${index}`}
            />
          </View>

          <View style={{marginBottom: 20}}>
            <Text style={styles.title}>Why Choose Us?</Text>
            <FlatList
              data={whyChooseUs}
              renderItem={({item}) => (
                <Text style={styles.listItem}>{`\u2022 ${item}`}</Text>
              )}
              keyExtractor={(item, index) => `why-${index}`}
            />
          </View>

          <View>
            <Text style={styles.title}>Serving Cities Across India</Text>
            <Text style={styles.midDescription}>
              With our successful presence in Delhi NCR, we’ve expanded to serve
              cities across India, including Mumbai, Pune, Bangalore, Hyderabad,
              Chennai, Jaipur, and more—offering affordable and reliable
              cleaning services everywhere.
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Pricing Section */}
      <FlatList
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
    </ScrollView>
  );
};

export default index;

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
});
