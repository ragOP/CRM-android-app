import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

type PlaceOrderParams = {
  payload: any;
};

export const placeOrder = async ({payload}: PlaceOrderParams) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.order,
      method: 'POST',
      data: payload,
    });

    return apiResponse;
  } catch (error) {
    console.error('error');
  }
};
