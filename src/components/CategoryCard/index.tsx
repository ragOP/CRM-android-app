import {View, Text, StyleSheet, Image} from 'react-native';

interface CategoryCardProps {
  label: string;
  image: any;
}

const CategoryCard: React.FC<CategoryCardProps> = ({label, image}) => {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{label}</Text>
    </View>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F3FAFC',
    flex: 1,
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
});
