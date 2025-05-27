import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

type CustomSearchProps = {
  searchText?: string;
  onChange?: (value: string) => void;
  onSearch?: () => void;
  redirectToUniversalScreen?: boolean;
};

const CustomSearch = ({
  searchText,
  onChange,
  onSearch,
  redirectToUniversalScreen = false,
}: CustomSearchProps) => {
  const navigation = useNavigation();

  const onBack = () => {
    navigation.goBack();
  };

  const onNavigateToUniversalSearch = () => {
    navigation.navigate('HomeTab', {
      screen: 'UniversalSearch',
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={{flex: 1, marginLeft: 10}}>
        {redirectToUniversalScreen ? (
          <Pressable onPress={onNavigateToUniversalSearch}>
            <View style={styles.fakeInput}>
              <View style={styles.fakeInputInnerRow}>
                <Icon name="search-outline" size={24} color="#000" />
                <Text style={styles.placeholder}>
                  {searchText || 'Search for products'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={onSearch}
                style={styles.searchButton}
                disabled={true}>
                <Text style={styles.searchText} disabled={true}>
                  Search
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        ) : (
          <SearchBox
            searchText={searchText}
            onChange={onChange}
            onSearch={onSearch}
          />
        )}
      </View>
    </View>
  );
};

export default CustomSearch;

export const SearchBox = ({
  searchText,
  onChange,
  onSearch,
  editable = true,
}) => {
  return (
    <View style={styles.searchContainer}>
      <Icon name="search-outline" size={16} color="#000" />
      <TextInput
        placeholder="Search products"
        placeholderTextColor="#888"
        style={styles.input}
        value={searchText}
        onChangeText={onChange}
        pointerEvents={editable ? 'auto' : 'none'}
      />
      <TouchableOpacity
        onPress={onSearch}
        style={styles.searchButton}
        disabled={!editable}>
        <Text style={styles.searchText} disabled={editable}>
          Search
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 50,
    alignItems: 'center',
    flex: 1,
    paddingLeft: 12,
    paddingRight: 4,
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
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  searchText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fakeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 50,
    backgroundColor: '#fff',
    borderColor: '#4D4D4D',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    flex: 1,
  },
  fakeInputInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholder: {
    marginLeft: 8,
    fontSize: 14,
    color: '#888',
  },
});
