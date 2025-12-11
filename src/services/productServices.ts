import { Order } from "@/app/order/interface";
import { SingleProductType } from "@/data/types";
import { config } from "@/lib/config";
import axios from "axios";

export const fetchProductById = async (
  productId: string
): Promise<SingleProductType | null> => {
  try {
    const response = await fetch(config.product.getProductById(productId), {
      next: { revalidate: 10 } // Cache for 10 seconds to balance freshness and performance
    });
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


export const fetchAllProducts = async (
): Promise<SingleProductType[]> => {
  try {
    const response = await fetch(`${config.product.getProducts()}?limit=${500}`, {
      next: { revalidate: 30 } // Cache for 30 seconds to balance freshness and performance
    });
    if (!response.ok) {
      return [];
    }
    const productData = await response.json();
    return productData.products as SingleProductType[] ?? []; // Assuming your API response matches Product interface
  } catch (error) {
    console.error("Error fetching product:", error);
    return [];
  }
};


export const fetchOrderDetails = async (
  orderId: string
): Promise<Order | null> => {
  try {
    const response = await fetch(config.order.getOrderDetails(orderId), { cache: 'no-store' });
    if (!response.ok) {
      return null;
    }
    const orderData = await response.json();
    return orderData.data as Order; // Assuming your API response matches Product interface
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

export const fetchBulkProducts = async (
  productIds: number[]
): Promise<SingleProductType[]> => {
  try {
    const response = await axios.post(
      config.product.getBulkProducts(),
      { productIds },
      { timeout: 10000 }
    );

    if (response.status < 300) {
      return response.data as SingleProductType[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching bulk products:", error);
    return [];
  }
};
