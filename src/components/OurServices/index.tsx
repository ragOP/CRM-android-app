import {View, Text, StyleSheet, FlatList} from 'react-native';
import CustomCard from '../CustomCard/index';

const index = () => {
  const services = [
    {
      title: 'BATHROOM CLEANING',
      description:
        'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
      image: require('../../assets/bathroomCleaning.png'),
    },
    {
      title: 'MARBLE POLISHING',
      description:
        'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
      image: require('../../assets/bathroomCleaning.png'),
    },
    {
      title: 'SOFA CLEANING',
      description:
        'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
      image: require('../../assets/bathroomCleaning.png'),
    },
    {
      title: 'SOFA CLEANING',
      description:
        'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
      image: require('../../assets/bathroomCleaning.png'),
    },
    {
      title: 'SOFA CLEANING',
      description:
        'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
      image: require('../../assets/bathroomCleaning.png'),
    },
    {
      title: 'SOFA CLEANING',
      description:
        'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
      image: require('../../assets/bathroomCleaning.png'),
    },
    {
      title: 'SOFA CLEANING',
      description:
        'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
      image: require('../../assets/bathroomCleaning.png'),
    },
    {
      title: 'SOFA CLEANING',
      description:
        'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
      image: require('../../assets/bathroomCleaning.png'),
    },
    {
      title: 'SOFA CLEANING',
      description:
        'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
      image: require('../../assets/bathroomCleaning.png'),
    },
    {
      title: 'SOFA CLEANING',
      description:
        'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
      image: require('../../assets/bathroomCleaning.png'),
    },
    {
      title: 'SOFA CLEANING',
      description:
        'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
      image: require('../../assets/bathroomCleaning.png'),
    },
    {
      title: 'SOFA CLEANING',
      description:
        'Expert sofa cleaning to remove stains, odors, and dust, restoring freshness and comfort to your furniture.',
      image: require('../../assets/bathroomCleaning.png'),
    },
  ];

  const renderItem = ({ item }: { item: typeof services[0] }) => (
    <CustomCard
      title={item.title}
      description={item.description}
      image={item.image}
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
        data={services}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: 'space-around' }}
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
    gap: 6,
  },
});
