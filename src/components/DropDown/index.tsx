import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface CustomDropdownProps {
  label?: string;
  selectedValue?: string;
  onValueChange?: (itemValue: string, itemIndex: number) => void;
  options?: { label: string; value: string }[];
  InputWidth?: number;     
  InputHeight?: number;    
  radius?: number;         
  fontSize?: number;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
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
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.pickerWrapper, { borderRadius: radius, height: InputHeight }]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={[styles.picker, { fontSize: fontSize }]}
          dropdownIconColor="#333"
        >
          <Picker.Item label="Select Your Service" value="" />
          {options.map(option => (
            <Picker.Item label={option.label} value={option.value} key={option.value} />
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
    color: '#333',
    marginBottom: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: '100%',
    color: '#000',
  },
});
