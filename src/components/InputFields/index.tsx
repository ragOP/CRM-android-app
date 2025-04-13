import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';

interface CustomInputProp {
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  value?: any;
  onChangeText?: (text: any) => void;
  InputWidth?: number;
  maxLength?: number;
}

const CustomInputField: React.FC<CustomInputProp> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  InputWidth = 100,
  maxLength
}) => {
  return (
    <View style={[styles.container, {width: `${InputWidth}%`}]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoFocus={true}
        editable={true}  
        selectTextOnFocus={true}
        maxLength={maxLength}
      />
    </View>
  );
};

export default CustomInputField;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
