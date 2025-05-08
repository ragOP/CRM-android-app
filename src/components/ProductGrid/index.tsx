import React from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import ProductCard from '../ProductCard';
import {useNavigation} from '@react-navigation/native';
import {getDiscountBasedOnRole} from '../../utils/products/getDiscountBasedOnRole';
import { useAppSelector } from '../../redux/store';

type ProductGridProps = {
  rows?: number;
  title: string;
  highlight?: {[key: string]: boolean};
  data: any;
  isCategory?: boolean;
  isLoading?: boolean;
};

const ProductGrid = ({
  rows = 2,
  title = '',
  highlight = {},
  data,
  isCategory = false,
  isLoading = false,
}: ProductGridProps) => {
  const navigation = useNavigation();

  const reduxAuth = useAppSelector((state) => state.auth);
  const reduxUser = reduxAuth.user;
  const reduxUserRole = reduxUser?.role || 'user';

  const renderCategoryCard = ({item}: {item: any}) => (
    <View style={styles.card}>
      <Image
        source={{uri: item.image}}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.discount}>{item.discount}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={{padding: 16}}>
        <ActivityIndicator size="large" color="#00008B" />
      </View>
    );
  }

  return (
    <View style={{padding: 16}}>
      <View style={styles.header}>
        <Text style={styles.saleText}>
          {title.split(' ').map((word, index) => {
            const lowerWord = word.toLowerCase().replace(/[^a-z0-9%]/gi, '');
            return (
              <Text
                key={index}
                style={highlight[lowerWord] ? styles.highlight : undefined}>
                {word + ' '}
              </Text>
            );
          })}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('UniversalSearch')}>
          <Text style={styles.viewAll}>View all →</Text>
        </TouchableOpacity>
      </View>

      {isCategory ? (
        <FlatList
          data={data}
          numColumns={rows}
          renderItem={renderCategoryCard}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{width: 12}} />}
          contentContainerStyle={{gap: 7}}
          columnWrapperStyle={{justifyContent: 'space-between'}}
        />
      ) : (
        <FlatList
          data={data}
          renderItem={({item}) => {
            const discountPrice = getDiscountBasedOnRole({
              role: reduxUserRole,
              discounted_price: item.discounted_price,
              original_price: item.price,
              salesperson_discounted_price: item.salesperson_discounted_price,
              dnd_discounted_price: item.dnd_discounted_price,
            });

            return (
              <ProductCard
                data={item}
                image={item?.banner_image}
                price={discountPrice}
                originalPrice={item?.price}
                title={item?.name}
                subtitle={item?.small_description}
              />
            );
          }}
          keyExtractor={item => item.id}
          numColumns={rows}
          columnWrapperStyle={{justifyContent: 'space-between'}}
        />
      )}
    </View>
  );
};

export default ProductGrid;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  saleText: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAll: {
    color: '#00008B',
    fontWeight: 'bold',
  },
  highlight: {
    color: '#00008B',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  title: {
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  discount: {
    color: '#00008B',
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
});
