import { SingleProductType } from "@/data/types";
import { config } from "@/lib/config";

export const fetchProductById = async (
  productId: string
): Promise<SingleProductType | null> => {
  try {
    const response = await fetch(config.product.getProductById(productId));
    if (!response.ok) {
      return null;
    }
    const productData = await response.json();
    return productData.product as SingleProductType; // Assuming your API response matches Product interface
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};
