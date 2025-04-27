import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image,
  } from 'react-native';
  import React from 'react';
  
  interface ButtonProps {
    title: string;
    buttonWidth: number;
    buttonHeight?: number;
    onPress?: () => void;
    isLoading?: boolean;
    iconName?: string;
    borderRadius?: number;
  }
  
  const CustomButton: React.FC<ButtonProps> = ({
    title,
    buttonWidth,
    buttonHeight,
    onPress,
    isLoading,
    iconName,
    borderRadius,  
  }) => {
    return (
      <TouchableOpacity
        disabled={isLoading}
        onPress={onPress}
        style={[
          styles.button,
          {opacity: isLoading ? 0.8 : 1, width: `${buttonWidth}%`, height: buttonHeight, borderRadius: borderRadius || 15},
        ]}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.row}>
            <Text style={styles.buttonText}>{title}</Text> 
            {iconName && <Image source={{ uri: iconName }} style={{ width: 20, height: 20 }} />}
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  export default CustomButton;
  
  const styles = StyleSheet.create({
    button: {
      padding: 20,
      borderRadius: 15,
      backgroundColor: '#00008B',
    },
    buttonText: {
      fontFamily: 'Popins',
      fontSize: 18,
      color: '#fff',
      textAlign: 'center',
      textTransform: 'uppercase',
    },
    row: {
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'center',
      gap: 5,
    },
  });
  