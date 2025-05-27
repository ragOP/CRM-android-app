import {isDev} from '../is_dev';

export const BACKEND_URL = isDev()
  ? 'http://10.0.2.2:8000'
  : 'https://393d-84-247-129-99.ngrok-free.app';
