import {StyleSheet, View, Text, Image, FlatList} from 'react-native';

const healthConditions = [
  {
    id: '1',
    name: 'Diabytes Care',
    image: require('../../assets/diabeties.png'),
  },
  {
    id: '2',
    name: 'Diabytes Care',
    image: require('../../assets/diabeties.png'),
  },
  {
    id: '3',
    name: 'Diabytes Care',
    image: require('../../assets/diabeties.png'),
  },
  {
    id: '4',
    name: 'Diabytes Care',
    image: require('../../assets/diabeties.png'),
  },
  {
    id: '5',
    name: 'Diabytes Care',
    image: require('../../assets/diabeties.png'),
  },
  {
    id: '6',
    name: 'Diabytes Care',
    image: require('../../assets/diabeties.png'),
  },
];

const HealthConditionSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Browse by <Text style={{color: '#00008B'}}>Health Condition</Text>
      </Text>
      <FlatList
        data={healthConditions}
        numColumns={3}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              <Image source={item.image} />
            </View>
            <Text style={styles.name}>{item.name}</Text>
          </View>
        )}
        contentContainerStyle={styles.cardContainer}
      />
    </View>
  );
};

export default HealthConditionSection;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  text: {
    fontSize: 20,
    fontFamily: 'poppins',
    color: '#1A1A1A',
    textAlign: 'center',
    fontWeight: '500',
  },
  imageContainer: {
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    justifyContent: 'center',
    borderRadius: 5
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
    gap: 7,
  },
  card: {
    backgroundColor: 'rgba(130, 200, 229, 0.2)',
    borderWidth: 1,
    borderColor: '#82C8E5',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 6,
    marginHorizontal: 3,
    alignItems: 'center'
  },
  name: {
    fontSize: 12,
    marginLeft: 5,
    textAlign: 'center'
  }
});
