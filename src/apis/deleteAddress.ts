import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

type DeleteAddressParams = {
  id: string | number;
};

export const deleteAddress = async ({id}: DeleteAddressParams) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.address}/${id}`,
      method: 'DELETE',
    });
    return apiResponse;
  } catch (error) {
    console.error('error');
  }
};
