import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

export const getAllCoupons = async () => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.coupon,
      method: 'GET',
    });

    return apiResponse;
  } catch (error) {
    console.error('error');
  }
};
