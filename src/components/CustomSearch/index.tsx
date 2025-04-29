import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

type CustomSearchProps = {
  searchText: string;
  onChange: (value: string) => void;
  onSearch: () => void;
};

const CustomSearch = ({searchText, onChange, onSearch}: CustomSearchProps) => {
  const navigation = useNavigation();

  const onBack = () => {
    navigation.goBack();
  };

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity onPress={onBack}>
          <Image source={require('../../assets/leftarrow.png')} />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Image
            source={require('../../assets/search-icon.png')} // replace with your actual icon
            style={{width: 16, height: 16, marginRight: 4}}
          />
          <TextInput
            placeholder="Search for “headache medicine”"
            placeholderTextColor="#888"
            style={styles.input}
            value={searchText}
            onChangeText={onChange}
          />
          <TouchableOpacity onPress={onSearch} style={styles.searchButton}>
            <Text style={styles.searchText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* <View style={styles.header}>
        <TouchableOpacity style={styles.upload}>
          <Image
            source={require('../../assets/prescriptionIcon.png')} // replace with your actual icon
            style={styles.icon}
          />
          <Text style={styles.prescriptionText}>Order with prescription. </Text>
          <Text style={styles.uploadNow}>UPLOAD NOW ›</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default CustomSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 50,
    alignItems: 'center',
    marginHorizontal: 10,
    paddingLeft: 12,
    paddingRight: 4,
    // paddingHorizontal: 12,
    paddingVertical: 4,
    borderColor: '#4D4D4D',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#4D4D4D',
  },
  searchButton: {
    backgroundColor: '#00008B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  searchText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  upload: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  icon: {
    width: 12,
    height: 12,
    marginRight: 4,
  },
  prescriptionText: {
    fontSize: 10,
    color: '#333',
  },
  uploadNow: {
    fontSize: 10,
    color: '#00008B',
    fontWeight: 'bold',
  },
});
