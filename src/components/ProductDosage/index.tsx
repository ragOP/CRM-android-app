import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ProductDosageProps {
  dosage: {
    timing: string[];
    time: string[];
    icon?: string[];
  };
}

const ProductDosage: React.FC<ProductDosageProps> = ({ dosage }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medicine Dosage</Text>
        <TouchableOpacity>
          <Text style={styles.viewMore}>VIEW MORE</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.dosageContainer}>
        {dosage.timing.map((timing, index) => (
          <View key={index} style={styles.dosageItem}>
            {index === 0 && (
              <View style={styles.iconContainer}>
                <Text style={styles.sunIcon}><Icon name="weather-sunset" color={"#D9A600"} size={20} /></Text>
              </View>
            )}
            {index === 1 && (
              <View style={styles.iconContainer}>
                <Text style={styles.sunIcon}><Icon name="weather-sunny" color={'#D96900'} size={20} /></Text>
              </View>
            )}
            {index === 2 && (
              <View style={styles.iconContainer}>
                <Text style={styles.moonIcon}><Icon name="moon-waning-crescent" color={'#020968'} size={20} /></Text>
              </View>
            )}
            <View style={styles.textContainer}>
              <Text style={styles.timingText}>{timing}</Text>
              <Text style={styles.timeText}>{dosage.time[index]}</Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.detailText}>In detail description of the dosage</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
  },
  viewMore: {
    fontSize: 14,
    color: '#00008B',
    fontWeight: 'bold',
  },
  dosageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dosageItem: {
    alignItems: 'center',
    width: '33%',
  },
  iconContainer: {
    marginBottom: 5,
  },
  sunIcon: {
    fontSize: 24,
  },
  moonIcon: {
    fontSize: 24,
  },
  textContainer: {
    alignItems: 'center',
  },
  timingText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333333',
    marginBottom: 3,
  },
  timeText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  detailText: {
    fontSize: 13,
    color: '#333333',
    marginTop: 8,
  },
});

export default ProductDosage;