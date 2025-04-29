import {View, Text, StyleSheet, FlatList} from 'react-native';
import CustomCard from '../CustomCard/index';
import { Category } from '../../redux/slice/categorySlice';

interface OurServicesProps {
  categories?: Category[];
  onPress?: (id: string) => void;
}

const index: React.FC<OurServicesProps> = ({categories, onPress}) => {
  // const services = [
  //   {
  //     title: 'BATHROOM CLEANING',
  //     description:
  //       'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
  //     image: require('../../assets/bathroomCleaning.png'),
  //   },
  //   {
  //     title: 'MARBLE POLISHING',
  //     description:
  //       'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
  //     image: require('../../assets/bathroomCleaning.png'),
  //   },
  //   {
  //     title: 'SOFA CLEANING',
  //     description:
  //       'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
  //     image: require('../../assets/bathroomCleaning.png'),
  //   },
  //   {
  //     title: 'SOFA CLEANING',
  //     description:
  //       'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
  //     image: require('../../assets/bathroomCleaning.png'),
  //   },
  //   {
  //     title: 'SOFA CLEANING',
  //     description:
  //       'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
  //     image: require('../../assets/bathroomCleaning.png'),
  //   },
  //   {
  //     title: 'SOFA CLEANING',
  //     description:
  //       'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
  //     image: require('../../assets/bathroomCleaning.png'),
  //   },
  //   {
  //     title: 'SOFA CLEANING',
  //     description:
  //       'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
  //     image: require('../../assets/bathroomCleaning.png'),
  //   },
  //   {
  //     title: 'SOFA CLEANING',
  //     description:
  //       'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
  //     image: require('../../assets/bathroomCleaning.png'),
  //   },
  //   {
  //     title: 'SOFA CLEANING',
  //     description:
  //       'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
  //     image: require('../../assets/bathroomCleaning.png'),
  //   },
  //   {
  //     title: 'SOFA CLEANING',
  //     description:
  //       'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
  //     image: require('../../assets/bathroomCleaning.png'),
  //   },
  //   {
  //     title: 'SOFA CLEANING',
  //     description:
  //       'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
  //     image: require('../../assets/bathroomCleaning.png'),
  //   },
  //   {
  //     title: 'SOFA CLEANING',
  //     description:
  //       'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
  //     image: require('../../assets/bathroomCleaning.png'),
  //   },
  // ];

  const renderItem = ({ item }: { item: Category }) => (
    <CustomCard
      title={item.name}
      description={item.description}
      image={item.images[0]}
      onPress={() => onPress && onPress(item._id)}
    />
  );
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Our Services, We Clean It All – Big or Small!
      </Text>
      <Text style={styles.subHeading}>
        Explore our wide range of cleaning services designed for your lifestyle
      </Text>
      <FlatList
        data={categories}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: 'space-around', gap: 10 }}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    padding: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 20,
  },
  gridContainer: {
    gap: 10,

  },
});
