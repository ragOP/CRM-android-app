import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

type AddCartParams = {
  payload: any;
};

export const addCart = async ({payload}: AddCartParams) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.cart,
      method: 'POST',
      data: payload,
    });

    if (apiResponse?.response?.success) {
      return apiResponse?.response?.data?.cart;
    }

    return [];
  } catch (error) {
    console.error('error', error);
  }
};
