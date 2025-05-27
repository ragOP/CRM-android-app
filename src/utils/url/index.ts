import {isDev} from '../is_dev';

export const BACKEND_URL = isDev()
  ? 'https://techmi-crm-be-kirp.onrender.com'
  : 'https://techmi-crm-be-kirp.onrender.com';


// http://10.0.2.2:8000
