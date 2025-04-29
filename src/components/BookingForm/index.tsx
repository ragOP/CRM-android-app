import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import CustomInputField from '../InputFields';
import CustomDropdown from '../DropDown';
import CustomButton from '../Button';
import {Category} from '../../redux/slice/categorySlice';
import {fetchProducts} from '../../apis/fetchProducts';
import {useQuery} from '@tanstack/react-query';

interface BookingFormProps {
  title: string;
  categories?: Category[];
}

const index: React.FC<BookingFormProps> = ({title, categories}) => {
  const [selectedService, setSelectedService] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');

  const {data: products} = useQuery({
    queryKey: ['top_products', selectedService],
    queryFn: async () => {
      const apiResponse = await fetchProducts({
        params: {category_id: selectedService},
      });
      if (apiResponse?.response?.success) {
        return apiResponse?.response?.data?.data;
      }
      return [];
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.inputContainer}>
        <View style={{flex: 1, flexDirection: 'row', gap: 7}}>
          <CustomInputField
            fontSize={16}
            InputWidth={48}
            radius={50}
            placeholder="Name"
          />
          <CustomInputField
            fontSize={16}
            InputWidth={48}
            radius={50}
            placeholder="Phone Number"
          />
        </View>
        <View style={{flex: 1, flexDirection: 'row', gap: 7}}>
          <CustomDropdown
            InputHeight={50}
            fontSize={16}
            InputWidth={48}
            radius={50}
            label="Select Your Service"
            value=""
            selectedValue={selectedService}
            onValueChange={itemValue => {
              setSelectedService(itemValue);
            }}
            options={categories}
          />
          <CustomDropdown
            InputHeight={50}
            fontSize={16}
            InputWidth={48}
            radius={50}
            label="Select Your Package"
            selectedValue={selectedPackage}
            onValueChange={itemValue => setSelectedPackage(itemValue)}
            options={products}
          />
        </View>
      </View>

      <CustomButton
        borderRadius={50}
        buttonWidth={100}
        title="Book Your Cleaning"
        iconName={'../../assets/cleaningIcon.svg'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 7,
    gap: 7,
    shadowColor: '#000',
    elevation: 7,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins',
    color: '#000000',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 7,
    marginVertical: 10,
  },
});

export default index;
