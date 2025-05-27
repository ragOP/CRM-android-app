import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

type PlaceOrderParams = {
  payload: any;
};

export const buyNowOrder = async ({payload}: PlaceOrderParams) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.buyNow,
      method: 'POST',
      data: payload,
    });
    return apiResponse;
  } catch (error) {
    console.error('error');
  }
};
