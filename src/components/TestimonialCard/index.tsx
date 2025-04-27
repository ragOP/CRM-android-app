import {View, Text, Image, StyleSheet} from 'react-native';

interface TestimonialCardProps {
  name: string;
  testimonial: string;
  image?: any;
  isHomePage?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  testimonial,
  image,
  isHomePage = false,
}) => {
  return (
    <View style={[styles.container, isHomePage ? {backgroundColor: '#82C8E533', shadowColor: '#fff', borderRadius: 25} : {}]}>
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10}}>
        {isHomePage ? (
          <> 
            <Text style={[styles.name, {color: '#0F1030', }]}>{name}</Text>
            {image && <Image source={image} style={styles.image} />}
          </>
        ) : (
          <> 
            {image && <Image source={image} style={styles.image} />}
            <Text style={styles.name}>{name}</Text>
          </>
        )}
      </View>
      <Text style={[styles.testimonial, isHomePage ? {color: '#243858'} : {}]}>{testimonial}</Text>
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
    marginRight: 10,
    marginVertical: 10,
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
