import React from 'react';
import { View, StyleSheet } from 'react-native';

const DottedHorizontalRule = ({ 
  dotSize = 5, 
  dotColor = '#000', 
  spacing = 3, 
  containerStyle = {},
  thickness = 1
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.dotsContainer}>
        {Array(Math.ceil(350 / (dotSize + spacing)))
          .fill(null)
          .map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotSize,
                  height: thickness,
                  backgroundColor: dotColor,
                  marginRight: spacing,
                }
              ]}
            />
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    borderRadius: 0,
  },
});

export default DottedHorizontalRule;