import React from 'react';
import {View, ActivityIndicator, StyleSheet, ViewStyle} from 'react-native';

interface CustomLoaderProps {
  height?: ViewStyle['height'];
  width?: ViewStyle['width'];
  backgroundColor?: ViewStyle['backgroundColor'];
  size?: 'small' | 'large' | number;
}

const CustomLoader: React.FC<CustomLoaderProps> = ({
  height = '100%',
  width = '100%',
  backgroundColor = '#fff',
  size = 'large',
}) => {
  return (
    <View
      style={[
        styles.loaderContainer,
        {
          height: height as ViewStyle['height'],
          width: width as ViewStyle['width'],
          backgroundColor: backgroundColor as ViewStyle['backgroundColor'],
        },
      ]}>
      <ActivityIndicator size={size} color="#007AFF" />
    </View>
  );
};

export default CustomLoader;

const styles = StyleSheet.create({
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
