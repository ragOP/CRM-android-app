import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CategoryCard from '../CategoryCard';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { isArrayWithValues } from '../../utils/array/isArrayWithValues';
import { fetchServices, selectIsFetching, selectServices } from '../../redux/slice/servicesSlice';

interface GradientHeaderProps {
  title: string;
  description: string;
  height?: number;
  isHomePage?: boolean;
}

const screenWidth = Dimensions.get('window').width;
const horizontalPadding = 16 * 2; // paddingHorizontal: 16 on both sides
const gap = 10;

const GradientHeader = ({
  title,
  description,
  height,
  isHomePage,
}: GradientHeaderProps) => {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector(selectIsFetching);
  const services = useAppSelector(selectServices);

  useEffect(() => {
    if (isHomePage) {
      dispatch(fetchServices({}));
    }
  }, [dispatch, isHomePage]);

  // Calculate dynamic item width based on number of services
  const getItemWidth = (count: number) => {
    if (count === 0) return '100%';
    // total gaps = (count - 1) * gap
    const totalGap = (count - 1) * gap;
    const availableWidth = screenWidth - horizontalPadding - totalGap;
    return availableWidth / count;
  };

  // Skeleton loader (shows up to 4 gray boxes)
  const renderSkeleton = () => {
    const count = 3;
    const itemWidth = getItemWidth(count);
    return (
      <View style={styles.categoryContainer}>
        {Array.from({ length: count }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.categoryItem,
              styles.skeleton,
              { width: itemWidth, marginRight: i !== count - 1 ? gap : 0 },
            ]}
          />
        ))}
      </View>
    );
  };

  // Render services dynamically in a row
  const renderServices = () => {
    if (!isArrayWithValues(services)) return null;
    const items = services.slice(0, 4); // Show only 4
    const itemWidth = getItemWidth(items.length);
    return (
      <View style={styles.categoryContainer}>
        {items.map((category: any, index: number) => (
          <View
            key={index}
            style={[
              styles.categoryItem,
              { width: itemWidth, marginRight: index !== items.length - 1 ? gap : 0 },
            ]}
          >
            <CategoryCard
              label={category.name || ''}
              image={category.images?.[0]}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#82C8E5', '#F7F7F7']}
      style={[styles.header, { height }]}
    >
      <View style={styles.container}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.subTitle}>{description}</Text>
        {isHomePage && <>{isFetching ? renderSkeleton() : renderServices()}</>}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 25,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: 'Gilroy-Bold',
    color: '#04050B',
  },
  subTitle: {
    fontSize: 14,
    color: '#333333',
    marginTop: 4,
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    marginTop: 12,
    width: '100%',
  },
  categoryItem: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  skeleton: {
    height: 90,
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
  },
});

export default GradientHeader;