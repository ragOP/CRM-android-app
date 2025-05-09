import {isDev} from '../is_dev';

export const BACKEND_URL = isDev()
  ? 'http://192.168.0.106:8000'
  : 'https://2c66-84-247-129-99.ngrok-free.app';
// export const BACKEND_URL = isDev()
//   ? 'http://192.168.0.103:8000'
//   : 'http://localhost:8000';
