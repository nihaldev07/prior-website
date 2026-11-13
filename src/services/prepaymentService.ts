import axios from "axios";
import { config } from "@/lib/config";

export interface PrepaymentOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface PrepaymentEvaluation {
  required: boolean;
  amount: number;
  appliedRule: {
    id: string | null;
    name: string;
    basis: string;
    matchedBy: string | null;
  } | null;
  breakdown: {
    ruleId: string | null;
    ruleName: string;
    basis: string;
    matchedBy: string | null;
    computedAmount: number;
  }[];
  zoneMatched: boolean;
  orderTotal: number;
  deliveryCharge: number;
  riskLevel?: string | null;
}

/**
 * Evaluate the server-configured prepayment rules for the current cart +
 * shipping address. Returns the required advance (if any) and which rule
 * produced it. Advisory — the backend re-evaluates at order creation.
 * customerPhone is needed only when a rule matches on fraud risk levels.
 */
export const evaluatePrepayment = async (
  shipping: { district?: string; division?: string },
  orderItems: PrepaymentOrderItem[],
  deliveryCharge?: number | null,
  customerPhone?: string | null
): Promise<PrepaymentEvaluation | null> => {
  try {
    const response = await axios.post(config.prepayment.evaluate(), {
      shipping,
      orderItems,
      deliveryCharge: deliveryCharge ?? null,
      customerPhone: customerPhone ?? "",
    });
    if (response.status < 300 && response.data?.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("Error evaluating prepayment rules:", error);
    return null;
  }
};
