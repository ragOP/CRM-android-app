import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

type UpdateAddressParams = {
  id: string | number;
  payload: any;
};

export const updateAddress = async ({id, payload}: UpdateAddressParams) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.address}/${id}`,
      data: payload,
      method: 'PUT',
    });

    return apiResponse;
  } catch (error) {
    console.error('error');
  }
};
