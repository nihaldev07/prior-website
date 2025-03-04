import { Order } from "@/app/order/interface";
import { SingleProductType } from "@/data/types";
import { fetchAllProducts, fetchOrderDetails, fetchProductById } from "@/services/productServices";

export const getProductDataById = async (
  id: string
): Promise<SingleProductType | null> => {
  try {
    const response = await fetchProductById(String(id));
    return response;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};


export const getAllProducts = async (
): Promise<SingleProductType[]> => {
  try {
    const response = await fetchAllProducts();
    return response;
  } catch (error) {
    console.error("Error fetching product:", error);
    return [];
  }
};



export const getOrderDetails = async (
  id: string
): Promise<Order | null> => {
  try {
    const response = await fetchOrderDetails(String(id));
    return response;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};
