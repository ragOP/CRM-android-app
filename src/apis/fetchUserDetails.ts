import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

export const fetchUserDetails = async ({id}: {id: string}) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.user}/${id}`,
    });

    return apiResponse;
  } catch (error) {
    console.error('error');
  }
};
