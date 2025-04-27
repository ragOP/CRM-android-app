import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const filterOptions = [
  { label: 'Sort By', icon: 'chevron-down' },
  { label: 'Filter', icon: 'options-outline' },
  { label: 'Brand', icon: 'chevron-down' },
  { label: 'Price', icon: 'chevron-down' },
  { label: 'Discount', icon: 'chevron-down' },
  { label: 'Categories', icon: 'chevron-down' },
];

const brand = [
  { id: '1', name: 'Mama Earth' },
  { id: '2', name: 'Fair & Handsome' },
  { id: '3', name: 'Ponds' },
  { id: '4', name: 'Phizer' },
  { id: '5', name: 'Dove' },
];

const Filter = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<{ [key: string]: boolean }>({});

  const openModal = (filterName: string) => {
    setSelectedFilter(filterName);
    setModalVisible(true);
  };

  const toggleBrand = (brandName: string) => {
    setSelectedBrands(prev => ({
      ...prev,
      [brandName]: !prev[brandName],
    }));
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <View style={styles.row}>
          {filterOptions.slice(0, 3).map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.filterButton}
              onPress={() => openModal(item.label)}
            >
              <Icon name={item.icon} size={20} color="#000" />
              <Text style={styles.filterButtonText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.row}>
          {filterOptions.slice(3).map((item, index) => (
            <TouchableOpacity
              key={index + 3}
              style={styles.filterButton}
              onPress={() => openModal(item.label)}
            >
              <Icon name={item.icon} size={20} color="#000" />
              <Text style={styles.filterButtonText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.bottomSheet}>
                <Text style={styles.modalTitle}>{selectedFilter}</Text>
                <View style={styles.separator} />
                {selectedFilter === 'Brand' ? (
                  <FlatList
                    data={brand}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.brandItem}
                        onPress={() => toggleBrand(item.name)}
                      >
                        <Text
                          style={
                            selectedBrands[item.name]
                              ? styles.selectedBrandText
                              : styles.brandText
                          }
                        >
                          {item.name}
                        </Text>
                        <View
                          style={[
                            styles.checkbox,
                            selectedBrands[item.name] && styles.checkboxSelected,
                          ]}
                        />
                      </TouchableOpacity>
                    )}
                  />
                ) : (
                  <View style={{ marginTop: 10 }}>
                    <Text style={{ textAlign: 'center', fontSize: 16, color: 'gray' }}>
                      {selectedFilter} options coming soon...
                    </Text>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default Filter;

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheet: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '50%',
  },
  separator: {
    height: 1,
    backgroundColor: '#4D4D4D',
    marginVertical: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  brandItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  brandText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  selectedBrandText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#00008B',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 3,
  },
  checkboxSelected: {
    backgroundColor: '#00008B',
    borderColor: '#00008B',
  },
  filterButtonText: {
    fontSize: 12,
  },
});
