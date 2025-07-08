import { config } from "@/lib/config";
import { ICampaign, ICampaingProducts } from "@/lib/interface";
import axios from "axios";
interface Iresponse {
  activeCampaign: ICampaign;
  products: ICampaingProducts[];
}

export interface OrderItem {
  productId: string; // MongoDB ObjectId or string
  quantity: number; // Number of units
  unitPrice: number; // Price per unit
}
const useCampaign = () => {
  const fetchActiveCampaign = async (): Promise<Iresponse | null> => {
    try {
      const response = await axios.get(config.campaign.getActiveCampaign());
      if (response?.status < 300 && response?.data?.success) {
        return response.data?.data;
      } else return null;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return null;
    }
  };

  const fetchActiveCampaignById = async (id: string) => {
    try {
      const response = await axios.get(config.campaign.getCampaignById(id));
      if (response?.status < 300 && response?.data?.success) {
        return response.data?.data;
      } else return null;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return null;
    }
  };

  const checkPrepaymentProducts = async (productIds: string[]) => {
    try {
      const response = await axios.post(config.campaign.checkPrepayment(), {
        productIds,
      });
      if (response?.status < 300 && response?.data?.success) {
        return response.data?.data;
      } else return null;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return null;
    }
  };

  const calculatePrepaymentAmount = async (
    orderItems: OrderItem[],
    deliveryCharge: number = 0
  ) => {
    try {
      const response = await axios.post(config.campaign.calculatePrepayment(), {
        orderItems,
        deliveryCharge,
      });
      if (response?.status < 300 && response?.data?.success) {
        return response.data?.data;
      } else return null;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return null;
    }
  };

  return {
    fetchActiveCampaign,
    fetchActiveCampaignById,
    checkPrepaymentProducts,
    calculatePrepaymentAmount,
  };
};

export default useCampaign;
