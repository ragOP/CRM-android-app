import React from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

type CustomCheckboxProps = {
  label?: string;
  checked: boolean;
  onChange?: () => void;
};

const CustomCheckbox = ({label, checked, onChange}: CustomCheckboxProps) => {
  return (
    <TouchableOpacity
      onPress={onChange}
      style={{flexDirection: 'row', alignItems: 'center'}}>
      <View
        style={{
          height: 24,
          width: 24,
          borderRadius: 6,
          borderWidth: 2,
          borderColor: '#00004d',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: checked ? '#00008B' : 'transparent',
        }}>
        {checked && <Icon name="check" size={16} color="#fff" />}
      </View>
      {label && (
        <Text style={{marginLeft: 10, fontSize: 16, color: '#333'}}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomCheckbox;
