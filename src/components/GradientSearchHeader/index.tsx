import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GradientSearchHeader = () => {
  return (
    <LinearGradient colors={['#82C8E5', '#F7F7F7']} style={[styles.container]}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.heading}>What are you looking for?</Text>
        {/* <TouchableOpacity style={styles.upload}>
          <Image
            source={require('../../assets/prescriptionIcon.png')} // replace with your actual icon
            style={styles.icon}
          />
          <Text style={styles.prescriptionText}>Order with prescription. </Text>
          <Text style={styles.uploadNow}>UPLOAD NOW ›</Text>
        </TouchableOpacity> */}
      </View>

      {/* Search Box */}
      <View style={styles.searchContainer}>
        <Image
          source={require('../../assets/search-icon.png')} // replace with your actual icon
          style={{width: 16, height: 16, marginRight: 4}}
        />
        <TextInput
          placeholder="Search products"
          placeholderTextColor="#888"
          style={styles.input}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default GradientSearchHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#d9f0fb',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heading: {
    fontSize: 12,
    fontWeight: 'bold',
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
    color: '#00009f',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 50,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
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
});
