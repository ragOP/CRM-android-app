import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CustomInputField from '../InputFields';
import CustomDropdown from '../DropDown';
import CustomButton from '../Button';
import {Category} from '../../redux/slice/categorySlice';
import {fetchProducts} from '../../apis/fetchProducts';
import {useQuery} from '@tanstack/react-query';
import {useAppDispatch} from '../../redux/store';
import {showSnackbar} from '../../redux/slice/snackbarSlice';

interface BookingFormProps {
  title: string;
  categories?: Category[];
  onClick?: (product_id: string) => void;
  isPending?: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  title,
  categories,
  onClick,
  isPending,
}) => {
  const dispatch = useAppDispatch();

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
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <CustomInputField
            fontSize={14}
            InputWidth={49}
            radius={50}
            placeholder="Name"
            value={bookingData.name}
            maxLength={72}
            onChangeText={text =>
              setBookingData(prev => ({...prev, name: text}))
            }
          />
          <CustomInputField
            fontSize={14}
            InputWidth={49}
            radius={50}
            placeholder="Phone Number"
            value={bookingData.phoneNumber}
            numeric
            maxLength={10}
            onChangeText={text =>
              setBookingData(prev => ({...prev, phoneNumber: text}))
            }
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <CustomDropdown
            InputHeight={50}
            fontSize={12}
            InputWidth={49}
            radius={50}
            label="Select Service"
            value=""
            selectedValue={bookingData.selectedService}
            onValueChange={itemValue => {
              setBookingData(prev => ({...prev, selectedService: itemValue}));
            }}
            options={categories}
          />
          <CustomDropdown
            InputHeight={50}
            fontSize={12}
            InputWidth={49}
            radius={50}
            label="Select Package"
            selectedValue={bookingData.selectedPackage}
            onValueChange={itemValue =>
              setBookingData(prev => ({...prev, selectedPackage: itemValue}))
            }
            options={products}
          />
        </View>
      </View>

      <CustomButton
        borderRadius={50}
        buttonWidth={100}
        title={isPending ? 'Loading....' : 'Book Now'}
        iconName={'../../assets/cleaningIcon.svg'}
        onPress={() => {
          const {name, phoneNumber, selectedService, selectedPackage} =
            bookingData;
          if (!name || !phoneNumber || !selectedService || !selectedPackage) {
            dispatch(
              showSnackbar({
                type: 'error',
                title: 'Please fill all the fields',
                placement: 'top',
              }),
            );
            return;
          }
          if (isPending) return;
          onClick && onClick(selectedPackage);
          setBookingData(prev => ({
            ...prev,
            name: '',
            phoneNumber: '',
            selectedService: '',
            selectedPackage: '',
          }));
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginHorizontal: 12,
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

export default BookingForm;
