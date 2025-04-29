import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {apiService} from '../../utils/api/apiService';
import {endpoints} from '../../utils/endpoints';

export interface Category {
  id: string;
  name: string;
  [key: string]: any;
}

export interface CategoriesState {
  isFetching: boolean;
  isFetched: boolean;
  data: Category[];
  params: Record<string, any>;
  error: string | null;
}

const initialState: CategoriesState = {
  isFetching: false,
  isFetched: false,
  data: [],
  params: {},
  error: null,
};

export const fetchCategories = createAsyncThunk<
  {data: Category[]; params: Record<string, any>},
  Record<string, any>,
  {rejectValue: string}
>('categories/fetchCategories', async (params = {}, {rejectWithValue}) => {
  try {
    const response = await apiService({endpoint: endpoints.category, params});
    return {data: response.response.data.categories, params};
  } catch (error: any) {
    return rejectWithValue(error?.response?.data || 'Something went wrong');
  }
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetCategories: state => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => {
        state.isFetching = true;
        state.isFetched = false;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: Category[];
            params: Record<string, any>;
          }>,
        ) => {
          state.isFetching = false;
          state.isFetched = true;
          state.data = action.payload.data;
          state.params = action.payload.params || {};
        },
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isFetching = false;
        state.isFetched = false;
        state.error =
          (action.payload as string) || 'Failed to fetch categories';
      });
  },
});

export const {resetCategories} = categoriesSlice.actions;
export const selectCategories = (state: {category: CategoriesState}) =>
  state.category.data;

export default categoriesSlice.reducer;
