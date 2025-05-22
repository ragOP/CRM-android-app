import {isDev} from '../is_dev';

export const BACKEND_URL = isDev()
  ? 'http://192.168.0.102:8000'
  : 'https://393d-84-247-129-99.ngrok-free.app';

