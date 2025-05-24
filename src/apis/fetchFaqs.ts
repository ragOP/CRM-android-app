import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

export const fetchFaqs = async () => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.faq}/users`,
    });

    if (apiResponse?.response?.success) {
      return apiResponse?.response?.data;
    }

    return [];
  } catch (error) {
    console.error('error');
  }
};
