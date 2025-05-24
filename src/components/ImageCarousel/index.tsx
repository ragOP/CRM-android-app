import React, {useState, useEffect, useRef} from 'react';
import {View, ScrollView, Image, Dimensions, StyleSheet} from 'react-native';
import { fetchAppBanners } from '../../apis/fetchAppBanners';
import { useQuery } from '@tanstack/react-query';
import {ActivityIndicator} from 'react-native';

const {width} = Dimensions.get('window');

const ImageCarousel: React.FC = () => {
    const {data, isLoading} = useQuery({
    queryKey: ['app_banners'],
    queryFn: fetchAppBanners,
  });

  const app_banners = data?.banner;
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const onScroll = (event: { nativeEvent: { contentOffset: { x: number; }; }; }) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  const scrollToNext = () => {
    const nextIndex = (activeIndex + 1) % app_banners?.length;
    scrollViewRef.current?.scrollTo({x: nextIndex * width, animated: true});

  };

  useEffect(() => {
    intervalRef.current = setInterval(scrollToNext, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeIndex]);

  const handleTouchStart = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleTouchEnd = () => {
    intervalRef.current = setInterval(scrollToNext, 1000);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      ) : (
        <View>
        <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}>
        {app_banners && app_banners.map((image, index) => (
          <Image key={image._id} source={{uri: image.url}} style={styles.image} />
        ))}
      </ScrollView>

      <View style={styles.dotsContainer}>
        {app_banners && app_banners?.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {backgroundColor: index === activeIndex ? '#00008B' : '#ccc'},
              {width: index === activeIndex ? 100 : 20},
            ]}
          />
        ))}
      </View>
        </View>
      )}
    </View>
  );
};

export default ImageCarousel;

export const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },
  image: {
    width: width,
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
    width: "80%",
    marginHorizontal: "auto",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
    backgroundColor: '#00008B',
  },
});
