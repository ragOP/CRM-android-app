import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

export const fetchTransactions = async () => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.transactions,
    });

    return apiResponse;
  } catch (error) {
    console.error('error', error);
  }
};
