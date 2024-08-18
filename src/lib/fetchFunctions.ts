import { SingleProductType } from "@/data/types";
import { fetchProductById } from "@/services/productServices";

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
