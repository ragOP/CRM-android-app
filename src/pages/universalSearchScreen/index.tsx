import {Text, FlatList, View} from 'react-native';
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
import {ActivityIndicator} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

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

  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const {service} = route.params || {};
  const reduxServices = useAppSelector(selectServices);

  const reduxAuth = useAppSelector(state => state.auth);
  const reduxUser = reduxAuth.user;
  const reduxUserRole = reduxUser?.role || 'user';

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

  const fetchMoreProducts = async () => {
    if (products.length >= totalProducts) {
      console.log('No more data to load');
      setHasMore(false);
      return;
    }
    setIsLoadingMore(true);

    const response = await fetchProducts({
      params: {
        ...filters,
        page,
        per_page: 20,
        category_id:
          !isArrayWithValues(filters.category_id) &&
          isArrayWithValues(categoriesList)
            ? categoriesList.map(c => c._id)
            : filters.category_id,
      },
    });

    if (response?.response?.success) {
      setProducts(prev => [...prev, ...response.response.data.data]);

      setTotalProducts(response.response.data.total);
      console.log('param page', response.response.data);
      if (response.response.data.length === 0) {
        setHasMore(false); // No more data to load
      } else {
        setPage(prev => prev + 1); // Increase page for next load
      }
    }

    setIsLoadingMore(false);
  };

  const handleReload = async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);

    const response = await fetchProducts({
      params: {
        ...filters,
        page: 1,
        per_page: 20,
        category_id:
          !isArrayWithValues(filters.category_id) &&
          isArrayWithValues(categoriesList)
            ? categoriesList.map(c => c._id)
            : filters.category_id,
      },
    });

    if (response?.response?.success) {
      setProducts(response.response.data.data);
      setTotalProducts(response.response.data.total);
      setPage(2);
    }

    setRefreshing(false);
  };

  useEffect(() => {
    const loadInitialProducts = async () => {
      try {
        setPage(1);
        setHasMore(true);

        setIsLoading(true);

        const response = await fetchProducts({
          params: {
            ...filters,
            page: 1,
            per_page: 20,
            category_id:
              !isArrayWithValues(filters.category_id) &&
              isArrayWithValues(categoriesList)
                ? categoriesList.map(c => c._id)
                : filters.category_id,
          },
        });

        if (response?.response?.success) {
          setProducts(response.response.data.data);
          setTotalProducts(response.response.data.total);
          setPage(2);
        }
      } catch (error) {
        console.error('Error loading initial products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (categoriesList) {
      loadInitialProducts();
    }
  }, [filters, categoriesList]);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <FlatList
      ListHeaderComponent={
        <>
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
        </>
      }
      data={products}
      renderItem={({item}) => (
        <ProductCard
          data={item}
          image={item?.banner_image}
          price={item?.discounted_price}
          originalPrice={item?.price}
          title={item?.name}
          subtitle={item?.small_description}
        />
      )}
      keyExtractor={item => item._id}
      numColumns={2}
      columnWrapperStyle={{justifyContent: 'space-between'}}
      contentContainerStyle={{paddingHorizontal: 8, paddingVertical: 8}}
      onEndReached={fetchMoreProducts}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={handleReload}
      ListEmptyComponent={
        <View
          style={{
            flex: 1,
            marginTop: 100,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 32,
          }}>
          <Icon
            name="cube-outline"
            size={54}
            color="grey"
            style={{marginBottom: 12}}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#888',
              marginBottom: 6,
              textAlign: 'center',
            }}>
            No Products Found
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#aaa',
              textAlign: 'center',
              lineHeight: 20,
            }}>
            We couldn't find any products matching your search or filters.
          </Text>
        </View>
      }
    />
  );
};

export default UniversalSearchScreen;
