import React, {Dispatch, SetStateAction, useState} from 'react';
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
import {FilterType} from '../../pages/universalSearchScreen';
import {isArrayWithValues} from '../../utils/array/isArrayWithValues';
import CustomCheckbox from '../CustomCheckBox';

export type FilterOption = {
  label: string;
  icon: string;
  key: 'category' | 'price';
};

type FilterProps = {
  filters: FilterType;
  setFilters: Dispatch<SetStateAction<FilterType>>;
  categoriesList: any[];
};

const Filter = ({filters, setFilters, categoriesList}: FilterProps) => {
  const filterOptions: FilterOption[] = [
    {label: 'Categories', icon: 'chevron-down', key: 'category'},
    {label: 'Price', icon: 'chevron-down', key: 'price'},
  ];

  console.log('categoriesList', categoriesList);

  const dataMap = {
    category: isArrayWithValues(categoriesList)
      ? categoriesList?.map(category => ({
          id: category._id,
          label: category.name,
          value: category._id,
        }))
      : [],
    price: [
      {id: '1', label: '₹0 - ₹500', value: '0_500'},
      {id: '2', label: '₹500 - ₹1000', value: '500_1000'},
      {id: '3', label: '₹1000+', value: '1000'},
    ],
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption | null>(
    null,
  );
  console.log('filters', filters, selectedFilter, modalVisible);

  const openModal = (filter: FilterOption) => {
    console.log(filter);
    setSelectedFilter(filter);
    setModalVisible(true);
  };

  const toggleSelection = (filterKey: 'category' | 'price', value: string) => {
    setFilters(prev => {
      const key = filterKey === 'category' ? 'category_id' : 'price_range';
      const prevValues = prev[key] || [];

      const isSelected = prevValues.includes(value);
      const newValues = isSelected
        ? prevValues.filter(v => v !== value)
        : [...prevValues, value];

      return {
        ...prev,
        [key]: newValues,
      };
    });
  };

  const isValueSelected = (filterKey: 'category' | 'price', value: string) => {
    const key = filterKey === 'category' ? 'category_id' : 'price_range';
    return filters[key]?.includes(value);
  };

  const getSelectedCount = (key: 'category' | 'price') => {
    if (key === 'category') {
      return filters.category_id.length;
    }
    if (key === 'price') {
      return filters.price_range.length;
    }
    return 0;
  };

  const renderList = () => {
    if (!selectedFilter?.key) {
      return null;
    }

    const items = dataMap[selectedFilter.key] || [];

    if (!items.length) {
      return <Text style={styles.comingSoon}>No options available</Text>;
    }

    return (
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          const selected = isValueSelected(selectedFilter.key, item.value);
          return (
            <TouchableOpacity
              style={styles.brandItem}
              onPress={() => toggleSelection(selectedFilter.key, item.value)}>
              <Text
                style={selected ? styles.selectedBrandText : styles.brandText}>
                {item.label}
              </Text>
              <CustomCheckbox
                checked={selected}
                onChange={() => toggleSelection(selectedFilter.key, item.value)}
              />
              {/* <View
                style={[styles.checkbox, selected && styles.checkboxSelected]}
              /> */}
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  return (
    <View>
      <View style={styles.row}>
        {filterOptions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.filterButton}
            onPress={() => openModal(item)}>
            <Icon name={item.icon} size={20} color="#000" />
            <Text style={styles.filterButtonText}>{item.label}</Text>
            {getSelectedCount(item.key) > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {getSelectedCount(item.key)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.bottomSheet}>
                {selectedFilter?.key ? (
                  <>
                    <Text style={styles.modalTitle}>
                      {selectedFilter.label}
                    </Text>
                    <View style={styles.separator} />
                    {renderList()}
                  </>
                ) : (
                  <Text style={styles.comingSoon}>Loading...</Text>
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
  filterButtonText: {
    fontSize: 16,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
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
    borderRadius: 4,
  },
  checkboxSelected: {
    backgroundColor: '#00008B',
  },
  comingSoon: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  badge: {
    backgroundColor: '#00008B',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
