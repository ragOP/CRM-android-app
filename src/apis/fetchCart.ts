import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

type FetchCartParams = {
  params: any;
};

export const fetchCart = async ({params}: FetchCartParams) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.cart,
      params,
    });
console.log('apiResponse', apiResponse);
    if (apiResponse?.response?.success) {
      return apiResponse?.response?.data?.cart;
    }

    return [];
  } catch (error) {
    console.error('error', error);
  }
};
