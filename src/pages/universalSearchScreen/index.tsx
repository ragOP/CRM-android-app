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
import {getDiscountBasedOnRole} from '../../utils/products/getDiscountBasedOnRole';

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
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Optional: To stop loading more when done

  const {service} = route.params || {};
  const reduxServices = useAppSelector(selectServices);

  const reduxAuth = useAppSelector(state => state.auth);
  const reduxUser = reduxAuth.user;
  const reduxUserRole = reduxUser?.role || 'user';

  const [filters, setFilters] = useState<FilterType>({
    page: 1,
    per_page: 10,
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
      per_page: 10,
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

  const fetchMoreProducts = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    const response = await fetchProducts({
      params: {
        ...filters,
        page,
        per_page: 10,
        category_id:
          !isArrayWithValues(filters.category_id) &&
          isArrayWithValues(categoriesList)
            ? categoriesList.map(c => c._id)
            : filters.category_id,
      },
    });

    if (response?.response?.success) {
      const newProducts = response.response.data.data;
      setProducts(prev => [...prev, ...newProducts]);

      if (newProducts.length === 0) {
        setHasMore(false); // No more data to load
      } else {
        setPage(prev => prev + 1); // Increase page for next load
      }
    }

    setIsLoadingMore(false);
  };

useEffect(() => {
  const loadInitialProducts = async () => {
    setPage(1);
    setHasMore(true);

    const response = await fetchProducts({
      params: {
        ...filters,
        page: 1,
        per_page: 10,
      },
    });

    if (response?.response?.success) {
      setProducts(response.response.data.data);
    }
  };

  loadInitialProducts();
}, [filters, categoriesList]);


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
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          contentContainerStyle={{padding: 16}}
          onEndReached={fetchMoreProducts}
          onEndReachedThreshold={0.5}
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
