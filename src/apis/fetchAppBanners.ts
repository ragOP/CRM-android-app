import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

export const fetchAppBanners = async () => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.app_banner,
    });

    console.log('apiResponse', apiResponse);
    if (apiResponse?.response?.success) {
      return apiResponse?.response?.data[0];
    }

    return [];
  } catch (error) {
    console.error('error');
  }
};
