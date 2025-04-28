import {configureStore} from '@reduxjs/toolkit';
import productSlice from './slice/productsSlice';
import categorySlice from './slice/categorySlice';
import servicesSlice from './slice/servicesSlice';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

export const store = configureStore({
  reducer: {
    products: productSlice,
    category: categorySlice,
    services: servicesSlice,
  },
});

// Types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
