import {combineReducers, configureStore} from '@reduxjs/toolkit';
import productSlice from './slice/productsSlice';
import categorySlice from './slice/categorySlice';
import servicesSlice from './slice/servicesSlice';
import authSlice from './slice/authSlice';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  keyPrefix: '',
  storage: AsyncStorage,
  whitelist: ['auth'], // Persist only the auth slice
};

const rootReducer = combineReducers({
  products: productSlice,
  category: categorySlice,
  services: servicesSlice,
  auth: authSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// Types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks for dispatch and selector
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
