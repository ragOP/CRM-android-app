import {apiService} from '../utils/api/apiService';
import {endpoints} from '../utils/endpoints';

type SignupPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignupUserParams = {
  payload: SignupPayload;
};

export const signupUser = async ({payload}: SignupUserParams) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.signup,
      method: 'POST',
      data: payload,
    });

    return apiResponse;
  } catch (error) {
    console.log(error);
  }
};
