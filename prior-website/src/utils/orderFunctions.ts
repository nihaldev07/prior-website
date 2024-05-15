import axios, { AxiosError } from "axios";
import { config } from "./config";
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Function to handle API errors
export const handleApiError = (
  error: AxiosError<any, any>
): ApiResponse<any> => {
  if (!!error && error?.response) {
    return {
      success: false,
      error: error?.response?.data.error || "Failed to process request",
    };
  } else if (error?.request) {
    return { success: false, error: "No response received from server" };
  } else {
    return { success: false, error: "Request failed" };
  }
};

// Function to create a new product
export const createOrder = async (
  orderData: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post<any>(
      config.order.createOrder(),
      orderData
    );
    if (response.status === 200) {
      return { success: true, data: response.data.data };
    } else {
      return {
        success: false,
        error: response.data.error || "Failed to create product",
      };
    }
  } catch (error: any) {
    console.error("Error creating product:", error.message);
    return handleApiError(error);
  }
};
