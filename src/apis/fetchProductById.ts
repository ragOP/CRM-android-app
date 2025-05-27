import { apiService } from "../utils/api/apiService";
import { endpoints } from "../utils/endpoints";

export const fetchProductById = async ({ id }: { id: string }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.product_by_id}/${id}`,
      method: "GET",
    });

    console.log("apiResponse", apiResponse);
    if (apiResponse?.response?.success) {
      return apiResponse?.response?.data;
    }

    return [];
  } catch (error) {
    console.error("error");
  }
};