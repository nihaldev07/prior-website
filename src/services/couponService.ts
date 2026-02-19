import { config } from "@/lib/config";
import axios from "axios";

// TypeScript interfaces for Coupon API
export interface Coupon {
  code: string;
  discountType: "fixed" | "percentage";
  discountValue: number;
  discountAmount: number;
  maxUses?: number;
  validUntil: string;
}

export interface ValidateCouponRequest {
  couponCode: string;
  customerPhone: string;
  orderTotal: number;
  products?: Array<{
    productId: string;
    category: string;
    quantity?: number;
  }>;
}

export interface ValidateCouponResponse {
  success: boolean;
  message: string;
  data: {
    valid: boolean;
    coupon?: Coupon;
    error?: string;
  };
}

export interface MyCoupon {
  _id: string;
  customerId: string;
  code: string;
  discountType: "fixed" | "percentage";
  discountValue: number;
  maxUses: number;
  usedCount: number;
  remainingUses: number;
  validFrom: string;
  validUntil: string;
  status: "active" | "expired" | "disabled";
  minOrderAmount: number;
  maxDiscountAmount?: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
}

export interface GetMyCouponsResponse {
  success: boolean;
  count: number;
  data: MyCoupon[];
}

export interface AutoApplyCouponRequest {
  customerPhone: string;
  orderTotal: number;
  products?: Array<{
    productId: string;
    category?: string;
    quantity: number;
  }>;
}

export interface AutoApplyCouponResponse {
  success: boolean;
  message: string;
  data: {
    code: string;
    discountType: "fixed" | "percentage";
    discountValue: number;
    discountAmount: number;
    maxUses: number;
    validUntil: string;
  } | null;
}

export const couponService = {
  // Validate coupon code
  validateCoupon: async (
    data: ValidateCouponRequest,
  ): Promise<ValidateCouponResponse> => {
    try {
      const response = await axios.post(config.coupon.validate(), {
        couponCode: data.couponCode.toUpperCase(),
        customerPhone: data.customerPhone,
        orderTotal: data.orderTotal,
        products: data.products,
      });

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return {
          success: false,
          message: "Failed to validate coupon",
          data: {
            valid: false,
            error: response.data?.message || "Unknown error",
          },
        };
      }
    } catch (error: any) {
      console.error("Error validating coupon:", error);
      return {
        success: false,
        message: "Error validating coupon",
        data: {
          valid: false,
          error:
            error.response?.data?.message || error.message || "Network error",
        },
      };
    }
  },

  // Get customer's coupons
  getMyCoupons: async (phone: string): Promise<GetMyCouponsResponse> => {
    try {
      const response = await axios.get(config.coupon.myCoupons(phone));

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return {
          success: false,
          count: 0,
          data: [],
        };
      }
    } catch (error: any) {
      console.error("Error fetching my coupons:", error);
      return {
        success: false,
        count: 0,
        data: [],
      };
    }
  },

  // Check auto-apply coupon
  checkAutoApply: async (
    data: AutoApplyCouponRequest,
  ): Promise<AutoApplyCouponResponse> => {
    try {
      const response = await axios.post(config.coupon.autoApply(), {
        customerPhone: data.customerPhone,
        orderTotal: data.orderTotal,
        products: data.products,
      });

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return {
          success: false,
          message: "Failed to check auto-apply coupon",
          data: null,
        };
      }
    } catch (error: any) {
      console.error("Error checking auto-apply coupon:", error);
      return {
        success: false,
        message: "Error checking auto-apply",
        data: null,
      };
    }
  },

  // Get global coupon details
  getCouponDetails: async (code: string) => {
    try {
      const response = await axios.get(config.coupon.details(code));

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return {
          success: false,
          message: "Failed to fetch coupon details",
        };
      }
    } catch (error: any) {
      console.error("Error fetching coupon details:", error);
      return {
        success: false,
        message: "Error fetching coupon details",
      };
    }
  },
};
