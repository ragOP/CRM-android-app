import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import CustomInputField from '../InputFields';
import CustomDropdown from '../DropDown';
import CustomButton from '../Button';
import CustomCheckbox from '../CustomCheckBox';

interface BookingFormProps {
  title: string;
  isLaundry?: boolean;
}

const dummyData = [
  {label: 'Option 1', value: '1'},
  {label: 'Option 2', value: '2'},
  {label: 'Option 3', value: '3'},
];

const index: React.FC<BookingFormProps> = ({title, isLaundry}) => {
  const [selectedService, setSelectedService] = useState('standard');
  return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.inputContainer}>
          <View style={{flex: 1}}>
            <CustomInputField
              fontSize={16}
              InputWidth={100}
              radius={50}
              placeholder="Name"
            />
            <CustomInputField
              fontSize={16}
              InputWidth={100}
              radius={50}
              placeholder="Phone Number"
            />
          </View>
          <View style={{flex: 1}}>
            <CustomInputField
              fontSize={16}
              InputWidth={100}
              radius={50}
              placeholder="City"
            />
            {isLaundry ? (
              <View>
                <CustomInputField
                  fontSize={16}
                  InputWidth={100}
                  radius={50}
                  placeholder="Pincode"
                  numeric
                />
              </View>
            ) : (
              <CustomDropdown
                InputHeight={50}
                fontSize={16}
                InputWidth={100}
                radius={50}
                selectedValue={selectedService}
                onValueChange={itemValue => setSelectedService(itemValue)}
                options={dummyData}
              />
            )}
          </View>
        </View>
        {isLaundry ? (
          <>
            <View style={styles.checkboxContainer}>
              <CustomCheckbox label="Home Cleaning" />
              <CustomCheckbox label="Shoes Cleaning" />
              <CustomCheckbox label="Laundry" />
              <CustomCheckbox label="Ironing" />
              <CustomCheckbox label="Dry Cleaning" />
            </View>
            <CustomButton buttonHeight={50} borderRadius={50} buttonWidth={50} title="Submit" />
          </>
        ) : (
          <CustomButton
            borderRadius={50}
            buttonWidth={100}
            title="Book Your Cleaning"
            iconName={'../../assets/cleaningIcon.svg'}
          />
        )}
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
    flexDirection: 'row',
    gap: 7,
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
