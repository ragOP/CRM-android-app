import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

type GetAllCouponsParams = {
  params: any;
};

export const getAllCoupons = async ({params}: GetAllCouponsParams) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.coupon,
      params,
      method: 'GET',
    });

    return apiResponse;
  } catch (error) {
    console.error('error');
  }
};
