import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

interface ForgetPasswordPayload {
  email: string;
}

interface ForgetPasswordParams {
  payload: ForgetPasswordPayload;
}

export const forgetPassword = async ({
  payload,
}: ForgetPasswordParams): Promise<any> => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.forgetPassword,
      method: 'POST',
      data: payload,
    });
    return apiResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
