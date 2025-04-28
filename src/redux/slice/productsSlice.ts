import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  status: '',
};

const productSlice = createSlice({
  name: 'Products',
  initialState,
  reducers: {
    logoutGallery: state => {
      state = initialState;
    },
  },
  extraReducers: builder => {},
});

export const {logoutGallery} = productSlice.actions;
export default productSlice.reducer;
