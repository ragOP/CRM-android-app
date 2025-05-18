import React, {useState} from 'react';
import {View, ScrollView, Image, Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');
const imageWidth = width - 40;

const images = [
  require('../../assets/slider-img.png'),
  require('../../assets/slider-img.png'),
  require('../../assets/slider-img.png'),
  require('../../assets/slider-img.png'),
  require('../../assets/slider-img.png'),
  require('../../assets/slider-img.png'),
  require('../../assets/slider-img.png'),
  require('../../assets/slider-img.png'),
];

const ImageCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = (event: { nativeEvent: { contentOffset: { x: number; }; }; }) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}>
        {images.map((image, index) => (
          <Image key={index} source={image} style={styles.image} />
        ))}
      </ScrollView>

      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {backgroundColor: index === activeIndex ? '#00008B' : '#ccc'},
              {width: index === activeIndex ? 150 : 20},
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default ImageCarousel;

export const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  image: {
    width: imageWidth,
    height: 250,
    borderRadius: 16,
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginHorizontal: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
    backgroundColor: '#00008B',
  },
});
