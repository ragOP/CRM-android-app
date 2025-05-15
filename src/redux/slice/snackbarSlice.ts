import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  SnackbarPlacement,
  SnackbarType,
} from '../../components/CustomSnackbar/CustomSnackbar';

type SnackbarState = {
  visible: boolean;
  type: SnackbarType;
  title: string;
  placement?: SnackbarPlacement;
  subtitle?: string;
  duration?: number;
};

const initialState: SnackbarState = {
  visible: false,
  type: 'info',
  title: '',
  subtitle: '',
  placement: 'bottom',
  duration: 3000,
};

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar: (
      state,
      action: PayloadAction<{
        type: SnackbarState['type'];
        title: string;
        subtitle?: string;
        placement?: SnackbarState['placement'];
        duration?: number;
      }>,
    ) => {
      state.visible = true;
      state.type = action.payload.type || 'info';
      state.duration = action.payload.duration || 3000;
      state.title = action.payload.title;
      state.placement = action.payload.placement || 'bottom';
      state.subtitle = action.payload.subtitle || '';
    },
    hideSnackbar: state => {
      state.visible = false;
    },
  },
});

export const {showSnackbar, hideSnackbar} = snackbarSlice.actions;
export default snackbarSlice.reducer;
