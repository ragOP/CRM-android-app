import { apiService } from '../utils/api/apiService';
import { endpoints } from '../utils/endpoints';

export interface QueryFormPayload {
  name: string;
  email: string;
  subject: string;
}

export interface SubmitQueryFormArgs {
  payload: QueryFormPayload;
}

export const submitQueryForm = async ({payload}: SubmitQueryFormArgs): Promise<any> => {
  try {
    console.log("Submitting query form with payload:", payload);
    const apiResponse = await apiService({
      endpoint: endpoints.contact,
      method: "POST",
      data: payload,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};