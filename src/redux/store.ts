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
  storage: AsyncStorage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  products: productSlice,
  category: categorySlice,
  services: servicesSlice,
  auth: persistReducer(persistConfig, authSlice),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// Types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
