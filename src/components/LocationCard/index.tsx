import { View, Text, StyleSheet } from 'react-native';

interface LocationCardProps {
  title: string;
  items: string[];
}

const LocationCard: React.FC<LocationCardProps> = ({ title, items }) => {
  return (
    <View style={styles.card}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{width: 2, height: 18, backgroundColor: '#848484'}}></View>
      <Text style={styles.title}>{title}</Text>
      </View>
      {items.map((item, index) => (
        <Text key={index} style={styles.item}>{item}</Text>
      ))}
    </View>
  );
};

export default LocationCard;

const styles = StyleSheet.create({
  card: {
    width: '30%',
  },
  title: {
    fontWeight: '700',
    marginBottom: 5,
    marginLeft: 5,
    fontSize: 18,
    color: '#1A1A1A',
  },
  item: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 2,
  },
});
