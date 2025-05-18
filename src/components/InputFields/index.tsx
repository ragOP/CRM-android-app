import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface CustomInputProp {
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  value?: any;
  onChangeText?: (text: any) => void;
  InputWidth?: number;
  InputHeight?: number;
  maxLength?: number;
  numeric?: boolean;
  radius?: number;
  fontSize?: number;
}

const CustomInputField: React.FC<CustomInputProp> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  InputWidth = 100,
  InputHeight,
  maxLength,
  numeric,
  radius = 8,
  fontSize = 16,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry;

  return (
    <View
      style={[
        styles.container,
        {width: `${InputWidth}%`, height: InputHeight},
      ]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, {borderRadius: radius, fontSize: fontSize}]}
          placeholder={placeholder}
          placeholderTextColor="#888"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPassword}
          autoFocus={true}
          editable={true}
          selectTextOnFocus={true}
          maxLength={maxLength}
          keyboardType={numeric ? 'number-pad' : 'default'}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(prev => !prev)}>
            <Icon
              name={showPassword ? 'eye-off' : 'eye'}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        )}
      </View>
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
    fontWeight: '500',
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
