import {View, Text, StyleSheet, FlatList, Dimensions} from 'react-native';
import CustomCard from '../CustomCard/index';
import {Category} from '../../redux/slice/categorySlice';

interface OurServicesProps {
  categories?: Category[];
  onPress?: (id: string) => void;
}

const screenWidth = Dimensions.get('window').width;
const CARD_GAP = 20;
const numColumns = 2;
const cardWidth = (screenWidth - CARD_GAP * (numColumns + 1)) / numColumns;

const OurServices = ({categories, onPress}: OurServicesProps) => {
  const renderItem = ({item}: {item: Category}) => (
    <CustomCard
      title={item.name}
      description={item.description}
      image={item.images[0]}
      onPress={() => onPress && onPress(item._id)}
      width={cardWidth}
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
        numColumns={numColumns}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
};

export default OurServices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },
});
