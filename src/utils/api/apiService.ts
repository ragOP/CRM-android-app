import axios, {AxiosRequestConfig, Method} from 'axios';
import {getItem} from '../local_storage';
import {BACKEND_URL} from '../url';

interface ApiServiceParams {
  endpoint: string;
  method?: Method; // GET, POST, PUT, DELETE, etc.
  data?: any;
  params?: Record<string, any>;
  token?: string;
  headers?: Record<string, string>;
  customUrl?: string;
  removeToken?: boolean;
  signal?: AbortSignal;
}

interface ApiServiceResponse {
  response?: any;
  success?: boolean;
  error?: any;
}

export const apiService = async ({
  endpoint,
  method = 'GET',
  data,
  params,
  token: _token,
  headers,
  customUrl,
  removeToken = false,
  signal,
}: ApiServiceParams): Promise<ApiServiceResponse> => {
  try {
    const userData = await getItem('userData');
    const token = userData?.token;

    const requestObj: AxiosRequestConfig = {
      url: `${customUrl ? customUrl : BACKEND_URL}/${endpoint}`,
      params,
      method,
      data,
      signal,
    };

    // console.log('Request Object:', requestObj);

    if (token || _token) {
      requestObj.headers = {
        ...headers,
        'ngrok-skip-browser-warning': 'xyz',
        ...(!removeToken ? {Authorization: `Bearer ${_token || token}`} : {}),
      };
    }

    const {data: res} = await axios(requestObj);
    return {response: res};
  } catch (error: any) {
    console.error(error, 'backend endpoint error');
    return {success: false, error: true, ...(error || {})};
  }
};
