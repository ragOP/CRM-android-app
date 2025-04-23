import {View, Text, Image, StyleSheet} from 'react-native';

interface TestimonialCardProps {
  name: string;
  testimonial: string;
  image?: any;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  testimonial,
  image,
}) => {
  return (
    <View style={styles.container}>
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10}}>
        {image && <Image source={image} style={styles.image} />}
        <Text style={styles.name}>{name}</Text>
      </View>
      <Text style={styles.testimonial}>{testimonial}</Text>
    </View>
  );
};

export default TestimonialCard;

const styles = StyleSheet.create({
  container: {
    width: 300,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    fontFamily: 'Figtree',
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
    color: '#0F1030',
  },
  testimonial: {
    fontSize: 16,
    lineHeight: 22,
    color: '#243858',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 15,
  },
});
