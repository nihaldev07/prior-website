import { config } from "@/lib/config";
import axios from "axios";

export interface IContact{
    name:String;
    email:String;
    phone:String;
    message:String;
}

export const createContactInfo = async (
  payload:IContact
): Promise<boolean> => {
  try {
    const response = await axios.post(config.contact.createContactQuery(),{
        ...payload
    });
    if (response.status===200 && response?.data?.success) {
      return true;
    }else return false;
    // Assuming your API response matches Product interface
  } catch (error) {
    console.error("Error fetching product:", error);
    return false;
  }
};
