import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

type FetchProductsParams = {
  params: any;
};

export const fetchProducts = async ({params}: FetchProductsParams) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.product,
      params: params,
    });

    return apiResponse;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
