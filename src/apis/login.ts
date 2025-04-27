import { apiService } from '../utils/api/apiService';
import { endpoints } from '../utils/endpoints';

interface LoginPayload {
  email: string;
  password: string;
  [key: string]: any;
}

interface LoginUserArgs {
  payload: LoginPayload;
}

export const loginUser = async ({ payload }: LoginUserArgs): Promise<any> => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.login,
      method: 'POST',
      data: payload,
    });
    return apiResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};