import {configureStore} from '@reduxjs/toolkit';
import productSlice from './slice/productsSlice';

export const store = configureStore({
  reducer: {
    products: productSlice,
  },
});
