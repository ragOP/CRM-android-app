import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

export const fetchTermsConditions = async () => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.terms_and_conditions}/users`,
    });

    if (apiResponse?.response?.success) {
      return apiResponse?.response?.data;
    }

    return [];
  } catch (error) {
    console.error('error');
  }
};
