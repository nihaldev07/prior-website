import { config } from "@/lib/config";
import axios from "axios";
const useCategory = () => {
  const fetchCategories = async () => {
    try {
      const response = await axios.get(config.product.getCategories());
      if (response?.status < 300 && response?.data?.success) {
        return response.data?.data;
      } else return [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  return { fetchCategories };
};

export default useCategory;
