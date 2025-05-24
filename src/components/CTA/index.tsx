import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import CustomButton from '../Button/CustomButton';

interface CustomCTAProps {
  leftImage?: any;
  text: string; // Text to display
  highlight?: {[key: string]: boolean}; // Words to highlight
  buttonText?: string; // Button text
  onPress?: () => void; // Function to call when button is pressed
}

const image = require('../../assets/left-cta-img.png'); // Default image

const CustomCTA: React.FC<CustomCTAProps> = ({
  leftImage,
  text,
  highlight = {},
  buttonText = 'Buy Now',
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/cta-bg.jpg')}
        style={styles.imageBackground}
        resizeMode="cover">
        <View style={{flexDirection: 'row'}}>
          <View style={styles.imageWrapper}>
            {leftImage && <Image source={leftImage} style={styles.image} />}
          </View>
          <View style={styles.content}>
            <Text style={styles.text}>
              {text.split(' ').map((word, index) => {
                 const lowerWord = word.toLowerCase().replace(/[^a-z0-9%]/gi, '');
                return (
                  <Text
                    key={index}
                    style={highlight[lowerWord] ? styles.highlight : null}>
                    {word + ' '}
                  </Text>
                );
              })}
            </Text>
            <TouchableOpacity style={styles.button} onPress={onPress}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default CustomCTA;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  imageWrapper: {
    gap: 8,
    marginRight: 16,
    width: 100,
    height: 120,
  },
  image: {
    position: 'absolute',
    top: -20,
  },
  content: {
    flex: 1,
    paddingVertical: 20,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#fff',
  },
  button: {
    backgroundColor: '#00008B',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    height: 100,
  },
});
