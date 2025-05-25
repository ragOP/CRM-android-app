import {View, Text, Image, StyleSheet} from 'react-native';

type TestimonialCardProps = {
  name: string;
  testimonial: string;
  image?: any;
  isHomePage?: boolean;
};

const TestimonialCard = ({
  name,
  testimonial,
  image,
  isHomePage = false,
}: TestimonialCardProps) => {
  const isHomeStyles = isHomePage ? styles.homeContainer : null;
  const nameTextStyle = isHomePage ? styles.homeName : styles.name;
  const testimonialTextStyle = isHomePage
    ? styles.homeTestimonial
    : styles.testimonial;

  return (
    <View style={[styles.container, isHomeStyles]}>
      <View style={styles.row}>
        {true ? (
          <>
            {image && (
              <Image
                source={{uri: image}}
                style={[styles.image, styles.imageRightMargin]}
              />
            )}
            <Text style={nameTextStyle}>{name}</Text>
          </>
        ) : (
          <>
            <Text style={nameTextStyle}>{name}</Text>
            {image && (
              <Image
                source={image}
                style={[styles.image, styles.imageLeftMargin]}
              />
            )}
          </>
        )}
      </View>
      <Text style={testimonialTextStyle}>
        {testimonial.length > 100
          ? `${testimonial.slice(0, 100)}...`
          : testimonial}
      </Text>
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    fontFamily: 'Figtree',
  },
  homeContainer: {
    backgroundColor: '#82C8E533',
    shadowColor: '#fff',
    borderRadius: 25,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    color: '#0F1030',
    flexShrink: 1,
  },
  homeName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    color: '#0F1030',
    flexShrink: 1,
  },
  testimonial: {
    fontSize: 16,
    lineHeight: 22,
    color: '#243858',
  },
  homeTestimonial: {
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
  imageLeftMargin: {
    marginLeft: 10,
  },
  imageRightMargin: {
    marginRight: 10,
  },
});
