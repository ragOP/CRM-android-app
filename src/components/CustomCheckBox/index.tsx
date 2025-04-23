import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CustomCheckboxProps {
  label?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ label }
) => {
  const [checked, setChecked] = useState(false);

  return (
    <TouchableOpacity onPress={() => setChecked(!checked)} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          height: 20,
          width: 20,
          borderWidth: 2,
          borderColor: '#82C8E5',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 10,
        }}
      >
        {checked && <View style={{ height: 20, width: 20, backgroundColor: '#82C8E5' }} />}
      </View>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}

export default CustomCheckbox;