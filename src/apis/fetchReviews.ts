import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

type FetchReviewsParams = {
  params: {
    productId: string;
    page?: number;
    per_page?: number;
  };
};

export const fetchReviews = async ({params}: FetchReviewsParams) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.reviews,
      params: params,
    });

    if (apiResponse?.response?.success) {
      return apiResponse?.response?.data;
    }

    return [];
  } catch (error) {
    console.error('error');
  }
};
