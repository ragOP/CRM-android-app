import {isDev} from '../is_dev';

export const BACKEND_URL = isDev()
  ? 'https://techmi-crm-be.onrender.com'
  : 'https://techmi-crm-be.onrender.com';
