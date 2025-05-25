import {isDev} from '../is_dev';

export const BACKEND_URL = isDev()
  ? 'https://393d-84-247-129-99.ngrok-free.app'
  : 'https://393d-84-247-129-99.ngrok-free.app';

