import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

type AddAddressParams = {
  payload: any;
};

export const addAddress = async ({payload}: AddAddressParams) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.address,
      method: 'POST',
      data: payload,
    });

    return apiResponse;
  } catch (error) {
    console.error('error');
  }
};
