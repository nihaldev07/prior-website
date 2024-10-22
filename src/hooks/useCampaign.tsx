import { config } from "@/lib/config";
import { ICampaign, ICampaingProducts } from "@/lib/interface";
import axios from "axios";
interface Iresponse {
  activeCampaign: ICampaign;
  products: ICampaingProducts[];
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

  return { fetchActiveCampaign, fetchActiveCampaignById };
};

export default useCampaign;
