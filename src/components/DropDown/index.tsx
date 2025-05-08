import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Category } from '../../redux/slice/categorySlice';

interface CustomDropdownProps {
  label?: string;
  value?: string;
  selectedValue?: string;
  onValueChange?: (itemValue: string, itemIndex: number) => void;
  options?: Category[];
  InputWidth?: number;     
  InputHeight?: number;    
  radius?: number;         
  fontSize?: number;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  value,
  selectedValue,
  onValueChange,
  options = [],
  InputWidth = 100,
  InputHeight = 50,
  radius = 8,
  fontSize = 16,
}) => {
  return (
    <View style={[styles.container, { width: `${InputWidth}%`, height: InputHeight }]}>
      {/* {label && <Text style={styles.label}>{label}</Text>} */}
      <View style={[styles.pickerWrapper, { borderRadius: radius, height: InputHeight }]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={[styles.picker, { fontSize: fontSize }]}
          dropdownIconColor="#333"
        >
          <Picker.Item style={[styles.picker, { fontSize: fontSize }]} label={label} value={value} key={value} />
          {options.map(option => (
            <Picker.Item style={[styles.picker, { fontSize: fontSize }]} label={option.name} value={option._id} key={option._id} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    color: '#000',
    marginBottom: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  picker: {
    width: '100%',
    color: '#333',
    fontWeight: '100',
  },
});
