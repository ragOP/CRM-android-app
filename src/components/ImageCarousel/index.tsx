import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/native';
import {fetchAppBanners} from '../../apis/fetchAppBanners';
import {fetchProductById} from '../../apis/fetchProductById';

const {width} = Dimensions.get('window');

// Constants
const AUTO_SCROLL_INTERVAL = 3000;
const RESTART_DELAY = 2000;
const DEFAULT_IMAGE_URL =
  'https://res.cloudinary.com/dacwig3xk/image/upload/v1748346009/uploads/images/uwntevpmelc4kddzqc41.jpg';

interface Banner {
  _id: string;
  url?: string;
  product?: string;
}

const ImageCarousel: React.FC = () => {
  const navigation = useNavigation();

  // API Query
  const {data, isLoading} = useQuery({
    queryKey: ['app_banners'],
    queryFn: fetchAppBanners,
  });

  // State
  const [activeIndex, setActiveIndex] = useState(0);

  // Refs
  const flatListRef = useRef<FlatList>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Derived data
  const banners: Banner[] = data?.banner || [];
  const hasMultipleBanners = banners.length > 1;

  // Auto-scroll management
  const clearAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    if (!hasMultipleBanners) return;

    clearAutoScroll();
    intervalRef.current = setInterval(() => {
      const nextIndex = (activeIndex + 1) % banners.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, AUTO_SCROLL_INTERVAL);
  }, [activeIndex, banners.length, hasMultipleBanners, clearAutoScroll]);

  // Scroll handling
  const handleScroll = useCallback(
    (event: {nativeEvent: {contentOffset: {x: number}}}) => {
      const slide = Math.round(event.nativeEvent.contentOffset.x / width);
      if (slide !== activeIndex && slide >= 0 && slide < banners.length) {
        setActiveIndex(slide);
      }
    },
    [activeIndex, banners.length],
  );

  // Touch handling
  const handleTouchStart = useCallback(() => {
    clearAutoScroll();
  }, [clearAutoScroll]);

  const handleTouchEnd = useCallback(() => {
    if (hasMultipleBanners) {
      setTimeout(startAutoScroll, RESTART_DELAY);
    }
  }, [hasMultipleBanners, startAutoScroll]);

  // Banner press handling
  const handleBannerPress = useCallback(
    async (banner: Banner) => {
      clearAutoScroll();

      try {
        if (banner.product) {
          const productData = await fetchProductById({id: banner.product});

          if (productData) {
            navigation.navigate('HomeTab', {
              screen: 'ProductScreen',
              params: {product: productData},
            });
          } else {
            console.warn('Product data not found for ID:', banner.product);
          }
        } else {
          console.log('No product ID found in banner');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }

      // Restart auto-scroll after delay
      if (hasMultipleBanners) {
        setTimeout(startAutoScroll, RESTART_DELAY);
      }
    },
    [navigation, clearAutoScroll, hasMultipleBanners, startAutoScroll],
  );

  // Render functions
  const renderBanner = useCallback(
    ({item: banner}: {item: Banner}) => (
      <TouchableOpacity
        key={banner._id}
        onPress={() => handleBannerPress(banner)}
        activeOpacity={0.8}
        style={styles.bannerContainer}>
        <Image
          source={{uri: banner.url || DEFAULT_IMAGE_URL}}
          style={styles.bannerImage}
          onError={error =>
            console.log('Image loading error:', error.nativeEvent.error)
          }
        />
      </TouchableOpacity>
    ),
    [handleBannerPress],
  );

  const renderDots = useCallback(() => {
    if (!hasMultipleBanners) return null;

    return (
      <View style={styles.dotsContainer}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    );
  }, [banners, activeIndex, hasMultipleBanners]);

  // Effects
  useEffect(() => {
    if (hasMultipleBanners) {
      startAutoScroll();
    }

    return clearAutoScroll;
  }, [hasMultipleBanners, startAutoScroll, clearAutoScroll]);

  // FlatList optimization
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: width,
      offset: width * index,
      index,
    }),
    [],
  );

  const handleScrollToIndexFailed = useCallback((info: any) => {
    console.log('Scroll to index failed:', info);
    flatListRef.current?.scrollTo({
      x: info.index * width,
      animated: true,
    });
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  // Empty state
  if (banners.length === 0) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderBanner}
        keyExtractor={item => item._id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews
      />
      {renderDots()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContainer: {
    width,
    height: 250,
  },
  bannerImage: {
    width,
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
    paddingHorizontal: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#00008B',
    width: 30,
  },
  inactiveDot: {
    backgroundColor: '#ccc',
    width: 8,
  },
});

export default ImageCarousel;
