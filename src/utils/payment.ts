import axios from "axios";
import { config } from "./config";

export const bkashCheckout = async (
  amount: number,
  orderId: number,
  customerName: string,
  mobileNumber: string,
  reference = 1
) => {
  try {
    const response = await axios.post(config.payment.bkashCheckout(), {
      amount,
      orderID: orderId,
      customerName,
      mobileNumber,
      callbackURL: config.payment.bkashCallback(),
      reference,
    });
    if (response.status === 200) {
      window.location.href = response?.data;
    }
  } catch (error) {
    console.error("bkash error:", error);
  }
};
