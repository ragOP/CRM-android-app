import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

export const fetchOrders = async () => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.ordermy,
    });

    return apiResponse;
  } catch (error) {
    console.error('error');
  }
};
