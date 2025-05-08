import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

type PlaceOrderParams = {
  payload: any;
};

export const placeOrder = async ({payload}: PlaceOrderParams) => {
  try {
    console.log('payload', payload);
    const apiResponse = await apiService({
      endpoint: endpoints.order,
      method: 'POST',
      data: payload,
    });
    console.log('API Response:', apiResponse);
    return apiResponse;
  } catch (error) {
    console.error('error');
  }
};
