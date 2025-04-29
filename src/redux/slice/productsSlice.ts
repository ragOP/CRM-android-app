import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {apiService} from '../../utils/api/apiService';
import {endpoints} from '../../utils/endpoints';

export interface Product {
  id: string;
  name: string;
  [key: string]: any;
}

export interface ProductsState {
  isFetching: boolean;
  isFetched: boolean;
  data: Product[];
  params: Record<string, any>;
  error: string | null;
}

const initialState: ProductsState = {
  isFetching: false,
  isFetched: false,
  data: [],
  params: {},
  error: null,
};

export const fetchProducts = createAsyncThunk<
  {data: Product[]; params: Record<string, any>},
  Record<string, any>,
  {rejectValue: string}
>('products/fetchProducts', async (params = {}, {rejectWithValue}) => {
  try {
    const response = await apiService({endpoint: endpoints.product, params});
    console.log('Products response:', response);
    return {data: response.response.data.data, params};
  } catch (error: any) {
    return rejectWithValue(error?.response?.data || 'Something went wrong');
  }
});

const productSlice = createSlice({
  name: 'Products',
  initialState,
  reducers: {
    resetProducts: state => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.isFetching = true;
        state.isFetched = false;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: Product[];
            params: Record<string, any>;
          }>,
        ) => {
          state.isFetching = false;
          state.isFetched = true;
          state.data = action.payload.data;
          state.params = action.payload.params || {};
        },
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isFetching = false;
        state.isFetched = false;
        state.error = (action.payload as string) || 'Failed to fetch services';
      });
  },
});

export const {resetProducts} = productSlice.actions;

export const selectProducts = (state: {products: ProductsState}) =>
  state.products.data;
export default productSlice.reducer;
