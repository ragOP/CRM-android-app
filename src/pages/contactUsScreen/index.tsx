import {View, Text, StyleSheet, ScrollView, Image, ActivityIndicator} from 'react-native';
import GradientHeader from '../../components/GradientHeader';
import ContactUsForm from '../../components/ContactUsForm';
import LocationCard from '../../components/LocationCard';
import Icon from 'react-native-vector-icons/Ionicons';
import {useQuery} from '@tanstack/react-query';
import {getFooterConfig} from '../../apis/getHeaderConfig';
const ContactUsScreen = () => {
  const {data: footerConfig, isLoading} = useQuery({
    queryKey: ['footer_config'],
    queryFn: () => getFooterConfig({}),
  });

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#00008B" />
        {/* <Text style={{marginTop: 10}}>Loading...</Text> */}
      </View>
    );
  }

  const location = [28.5691, 77.2786];

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <GradientHeader
        title="Get in touch with our team"
        description="Visit, call, or drop us a message—we’re just around the corner!"
      />
      <ContactUsForm />
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Your Locations, Your Connection</Text>

        {/* Locations */}
        <View style={styles.locationsContainer}>
          <LocationCard
            title="Mumbai"
            items={[
              'Thane',
              'Ghansoli',
              'Airoli',
              'Andheri',
              'Dadar',
              'Panvel',
            ]}
          />
          <LocationCard
            title="Ratnagiri"
            items={[
              'Thane',
              'Ghansoli',
              'Airoli',
              'Andheri',
              'Dadar',
              'Panvel',
            ]}
          />
          <LocationCard
            title="Delhi"
            items={['Ghaziabad', 'Dhupe', 'Noida', 'Jamshedpur', 'Nazempur']}
          />
        </View>

        {/* Contact Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoTextContainer}>
            <Icon name="call-outline" size={20} color="#00008B" />
            <Text style={styles.infoText}>+91 {footerConfig?.phoneNumber}</Text>
          </View>
          <View style={styles.infoTextContainer}>
            <Icon name="location-outline" size={20} color="#00008B" />
            <Text style={styles.infoText}>{footerConfig?.address}</Text>
          </View>
          <View style={styles.infoTextContainer}>
            <Icon name="time-outline" size={20} color="#00008B" />
            <Text style={styles.infoText}>{footerConfig?.timming}</Text>
          </View>
        </View>

        {/* Map Image */}
        <Image
          source={require('../../assets/map.jpg')}
          style={styles.mapImage}
          resizeMode="cover"
        />
      </View>
    </ScrollView>
  );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#1A1A1A',
  },
  locationsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  infoTextContainer: {
    flexDirection: 'column',
    width: '30%',
  },
  infoText: {
    fontSize: 12,
    color: '#1A1A1A',
    marginBottom: 10,
  },
  mapImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
});
