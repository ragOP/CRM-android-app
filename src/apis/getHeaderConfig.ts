import { apiService } from "../utils/api/apiService";
import { endpoints } from "../utils/endpoints";


export const getFooterConfig = async ({ payload }: any) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.header,
      method: "GET",
    });
    if(apiResponse?.response?.success){
        return apiResponse?.response?.data;
    }
    return {}
  } catch (error) {
    console.error(error);
    throw error;
  }
};