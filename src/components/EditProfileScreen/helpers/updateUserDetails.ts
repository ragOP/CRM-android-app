import {apiService} from '../../../utils/api/apiService';
import {endpoints} from '../../../utils/endpoints';

export const updateUserDetails = async ({
  id,
  updates,
}: {
  id: string;
  updates: any;
}) => {
  try {
    const apiResponse = await apiService({
      method: 'PUT',
      endpoint: `${endpoints.user}/${id}`,
      data: updates,
    });

    return apiResponse;
  } catch (error) {
    console.error('error');
  }
};
