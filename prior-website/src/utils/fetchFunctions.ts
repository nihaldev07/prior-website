import { SingleProductType } from "@/data/types";
import { fetchProductById } from "@/services/productServices";

export const getProductDataById = async (
  id: string
): Promise<SingleProductType | null> => {
  try {
    const productId = id;
    const parsedProductId = productId;

    const response = await fetchProductById(String(parsedProductId));

    return response;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};
