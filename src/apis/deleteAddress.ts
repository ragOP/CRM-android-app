import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

type DeleteAddressParams = {
  id: string | number;
};

export const deleteAddress = async ({id}: DeleteAddressParams) => {
  try {
    console.log('ID:', id);
    const apiResponse = await apiService({
      endpoint: `${endpoints.address}/${id}`,
      method: 'DELETE',
    });
    console.log('API Response:', apiResponse);
    return apiResponse;
  } catch (error) {
    console.error('error');
  }
};
