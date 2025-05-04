import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

type GetAddressesParams = {
  id: string | number;
};

export const getAddresses = async ({id}: GetAddressesParams) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.address}/user/${id}`,
    });

    return apiResponse;
  } catch (error) {
    console.error('error');
  }
};
