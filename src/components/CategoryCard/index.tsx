import {View, Text, StyleSheet, Image} from 'react-native';

interface CategoryCardProps {
  label: string;
  image: any;
}

const CategoryCard: React.FC<CategoryCardProps> = ({label, image}) => {
  return (
    <View style={styles.card}>
      {image ? (
        <Image
          source={{uri: image}}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
        {label || 'No Label'}
      </Text>
    </View>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F3FAFC',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    width: '100%',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    width: 90,
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  placeholder: {
    backgroundColor: '#e0e0e0',
  },
});
