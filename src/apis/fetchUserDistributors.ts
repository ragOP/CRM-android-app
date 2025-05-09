import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

type FetchUserDistributorsParams = {
  params: any;
};

export const fetchUserDistributors = async ({
  params,
}: FetchUserDistributorsParams) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.distributors,
      params,
    });

    return apiResponse;
  } catch (error) {
    console.error('error');
  }
};
