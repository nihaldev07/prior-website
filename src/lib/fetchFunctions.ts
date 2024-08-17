import { SingleProductType } from "@/data/types";
import { fetchProductById } from "@/services/productServices";

export const getProductDataById = async (
  id: string
): Promise<SingleProductType | null> => {
  try {
    console.log("wow2");
    const response = await fetchProductById(String(id));
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};
