import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {apiService} from '../../utils/api/apiService';
import {endpoints} from '../../utils/endpoints';

export interface Service {
  id: string;
  name: string;
  [key: string]: any;
}

export interface ServicesState {
  isFetching: boolean;
  isFetched: boolean;
  data: Service[];
  params: Record<string, any>;
  error: string | null;
}

const initialState: ServicesState = {
  isFetching: false,
  isFetched: false,
  data: [],
  params: {},
  error: null,
};

export const fetchReduxServices = createAsyncThunk<
  {data: Service[]; params: Record<string, any>},
  Record<string, any>,
  {rejectValue: string}
>('services/fetchServices', async (params = {}, {rejectWithValue}) => {
  try {
    const response = await apiService({endpoint: endpoints.service});
    return {data: response.response.data, params};
  } catch (error: any) {
    return rejectWithValue(error?.response?.data || 'Something went wrong');
  }
});

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    resetServices: state => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchReduxServices.pending, state => {
        state.isFetching = true;
        state.isFetched = false;
        state.error = null;
      })
      .addCase(
        fetchReduxServices.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: Service[];
            params: Record<string, any>;
          }>,
        ) => {
          state.isFetching = false;
          state.isFetched = true;
          state.data = action.payload.data;
          state.params = action.payload.params || {};
        },
      )
      .addCase(fetchReduxServices.rejected, (state, action) => {
        state.isFetching = false;
        state.isFetched = false;
        state.error = (action.payload as string) || 'Failed to fetch services';
      });
  },
});

export const {resetServices} = servicesSlice.actions;
export const selectServices = (state: {services: ServicesState}) =>
  state.services.data;
export const selectIsFetching = (state: {services: ServicesState}) =>
  state.services.isFetching;

export default servicesSlice.reducer;
