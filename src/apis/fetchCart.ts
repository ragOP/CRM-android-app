import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

type FetchCartParams = {
  params: any;
};

export const fetchCart = async ({params}: FetchCartParams) => {
  try {
    console.log('Fetching cart with params:',)
    const apiResponse = await apiService({
      endpoint: endpoints.cart,
      params,
    });
    console.log('Error fetching cart:', apiResponse);
    if (apiResponse?.response?.success) {
      return apiResponse?.response?.data?.cart;
    }

    return [];
  } catch (error) {
    console.error('error', error);
  }
};
