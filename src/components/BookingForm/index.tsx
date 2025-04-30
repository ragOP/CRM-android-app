import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Alert} from 'react-native';
import CustomInputField from '../InputFields';
import CustomDropdown from '../DropDown';
import CustomButton from '../Button';
import {Category} from '../../redux/slice/categorySlice';
import {fetchProducts} from '../../apis/fetchProducts';
import {useQuery} from '@tanstack/react-query';

interface BookingFormProps {
  title: string;
  categories?: Category[];
  onClick?: (product_id: string) => void;
  isPending?: boolean;
}

const index: React.FC<BookingFormProps> = ({title, categories, onClick, isPending}) => {
const [bookingData, setBookingData] = useState({
    name: '',
    phoneNumber: '',
    selectedService: '',
    selectedPackage: '',
  });
  const {data: products} = useQuery({
    queryKey: ['top_products', bookingData.selectedService],
    enabled: !!bookingData.selectedService,
    queryFn: async () => {
      const apiResponse = await fetchProducts({
        params: {category_id: bookingData.selectedService},
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
            maxLength={72}
            onChangeText={text => setBookingData(prev => ({...prev, name: text}))}
          />
          <CustomInputField
            fontSize={16}
            InputWidth={48}
            radius={50}
            placeholder="Phone Number"
            numeric
            maxLength={10}
            onChangeText={text => setBookingData(prev => ({...prev, phoneNumber: text}))}
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
            selectedValue={bookingData.selectedService}
            onValueChange={itemValue => {
              setBookingData(prev => ({...prev, selectedService: itemValue}));
            }}
            options={categories}
          />
          <CustomDropdown
            InputHeight={50}
            fontSize={16}
            InputWidth={48}
            radius={50}
            label="Select Your Package"
            selectedValue={bookingData.selectedPackage}
            onValueChange={itemValue => setBookingData(prev => ({...prev, selectedPackage: itemValue}))}
            options={products}
          />
        </View>
      </View>

      <CustomButton
        borderRadius={50}
        buttonWidth={100}
        title={isPending ? 'Loading....' : 'Book Your Cleaning'}
        iconName={'../../assets/cleaningIcon.svg'}
        onPress={() => {
          const { name, phoneNumber, selectedService, selectedPackage } = bookingData;
          if(!name || !phoneNumber || !selectedService || !selectedPackage) {
            Alert.alert('Error', 'Please fill all the fields');
            return;
          }
          if (isPending) return;
          onClick && onClick(selectedPackage);
          setBookingData(prev => ({...prev, name: '', phoneNumber: '', selectedService: '', selectedPackage: ''}));
        }}
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
    fontWeight: '700',
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
