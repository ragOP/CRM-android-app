import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

export const fetchPrivacyPolicy = async () => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.privacy_policy}/users`,
    });

    if (apiResponse?.response?.success) {
      return apiResponse?.response?.data;
    }

    return [];
  } catch (error) {
    console.error('error');
  }
};
