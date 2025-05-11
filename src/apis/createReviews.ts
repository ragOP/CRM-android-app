import {ReviewPayload} from '../pages/productScreen/components/ProductReviews';
import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

type CreateReviewParams = {
  payload: ReviewPayload;
};

export const createReviews = async ({payload}: CreateReviewParams) => {
  try {
    const {productId, ...bodyPayload} = payload;
    const apiResponse = await apiService({
      endpoint: endpoints.reviews,
      method: 'POST',
      data: bodyPayload,
      params: {
        productId: productId,
      },
    });
    console.log('apiResponse', payload, apiResponse);
    return apiResponse;
  } catch (error) {
    console.error('error');
  }
};
