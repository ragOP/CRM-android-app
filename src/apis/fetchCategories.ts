import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

type FetchCategoriesParams = {
  params: any;
};

export const fetchCategories = async ({params}: FetchCategoriesParams) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.category,
      method: 'GET',
      params,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
