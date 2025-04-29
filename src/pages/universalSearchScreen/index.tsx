import {Text, ScrollView, FlatList, View} from 'react-native';
import CustomSearch from '../../components/CustomSearch';
import Filter from '../../components/Filter';
import ProductCard from '../../components/ProductCard';
import {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {fetchProducts} from '../../apis/fetchProducts';
import {isArrayWithValues} from '../../utils/array/isArrayWithValues';
import {fetchCategories} from '../../apis/fetchCategories';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {selectServices} from '../../redux/slice/servicesSlice';
import {useRoute} from '@react-navigation/native';

export type FilterType = {
  category_id: string[];
  price_range: string[];
  search: string;
  page: number;
  per_page: number;
};

const UniversalSearchScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const route = useRoute();
  const {service} = route.params || {};
  console.log('category', service);
  const reduxServices = useAppSelector(selectServices);
  console.log('>> REDUX SERVICES', reduxServices);

  const [filters, setFilters] = useState<FilterType>({
    page: 1,
    per_page: 20,
    search: '',
    category_id: [],
    price_range: [],
  });
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const selectedServiceId = service?._id || null;
  const categoryId = null;

  const categoriesParams = {
    service_id: selectedServiceId,
  };

  const {data: categoriesList} = useQuery({
    queryKey: ['pharma_categories', categoriesParams],
    queryFn: async () => {
      const apiResponse = await fetchCategories({
        params: categoriesParams,
      });
      if (apiResponse?.response?.success) {
        return apiResponse?.response?.data?.categories;
      }
      return [];
    },
  });

  const params = {
    ...(filters || {}),
    category_id:
      !isArrayWithValues(filters.category_id) &&
      isArrayWithValues(categoriesList)
        ? categoriesList?.map(it => it?._id)
        : filters.category_id,
  };

  const onChangeSearchText = (value: string) => {
    setDebouncedQuery(value);
  };

  const onSearch = () => {
    setFilters({
      ...filters,
      search: debouncedQuery,
      page: 1,
      per_page: 20,
    });
  };

  const {data: allProducts, isLoading: isProductsLoading} = useQuery({
    queryKey: ['search_result_products', params],
    queryFn: async () => {
      const apiResponse = await fetchProducts({
        params,
      });
      if (apiResponse?.response?.success) {
        return apiResponse?.response?.data?.data;
      }
      return [];
    },
  });

  useEffect(() => {
    if (categoryId && isArrayWithValues(categoriesList)) {
      const currentCategory = categoriesList?.find(
        category => category._id === categoryId,
      );

      if (!currentCategory) {
        return;
      }
      setFilters({
        ...filters,
        category_id: [currentCategory?._id],
      });
    }
  }, [categoryId]);

  console.log('>>>', categoriesList, allProducts);

  // useEffect(() => {
  //   if (!isArrayWithValues(reduxServices)) {
  //     dispatch(fetchReduxServices({}));
  //   }
  // }, [dispatch]);

  return (
    <ScrollView>
      <CustomSearch
        searchText={debouncedQuery}
        onChange={onChangeSearchText}
        onSearch={onSearch}
      />
      <Filter
        filters={filters}
        setFilters={setFilters}
        categoriesList={categoriesList || []}
      />
      {isProductsLoading ? (
        // Skeleton loader for products
        <View style={{flexDirection: 'row', flexWrap: 'wrap', padding: 16}}>
          {[...Array(6)].map((_, idx) => (
            <View
              key={idx}
              style={{
                width: '48%',
                height: 180,
                backgroundColor: '#e0e0e0',
                borderRadius: 12,
                marginBottom: 16,
                marginRight: idx % 2 === 0 ? '4%' : 0,
              }}
            />
          ))}
        </View>
      ) : isArrayWithValues(allProducts) ? (
        <FlatList
          data={allProducts}
          renderItem={({item}) => (
            <ProductCard
              image={item?.banner_image}
              price={item?.discounted_price}
              originalPrice={item?.price}
              title={item?.name}
              subtitle={item?.small_description}
            />
          )}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          contentContainerStyle={{
            padding: 16,
          }}
        />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
          }}>
          <Text style={{fontSize: 16, color: '#888'}}>No products found</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default UniversalSearchScreen;
