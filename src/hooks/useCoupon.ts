import { couponService } from "@/services/couponService";
import type {
  Coupon,
  MyCoupon,
  ValidateCouponRequest,
  AutoApplyCouponRequest,
} from "@/services/couponService";

/**
 * Custom hook for coupon functionality
 * NOTE: Avoids useEffect/useState as requested
 * Functions return data directly for components to handle state
 */

export const useCoupon = () => {
  /**
   * Validate a coupon code
   * @param data - Coupon validation request data
   * @returns Validation response with coupon details if valid
   */
  const validateCouponCode = async (data: ValidateCouponRequest) => {
    return await couponService.validateCoupon(data);
  };

  /**
   * Fetch customer's available coupons
   * @param phone - Customer phone number
   * @returns List of customer's coupons
   */
  const fetchCustomerCoupons = async (phone: string) => {
    if (!phone) return { success: false, count: 0, data: [] };

    const response = await couponService.getMyCoupons(phone);
    return response;
  };

  /**
   * Check for auto-apply coupon
   * @param data - Auto-apply request data
   * @returns Best available auto-apply coupon or null
   */
  const fetchAutoApplyCoupon = async (data: AutoApplyCouponRequest) => {
    if (!data.customerPhone || data.orderTotal === 0) {
      return { success: true, message: "No auto-apply coupons available", data: null };
    }

    return await couponService.checkAutoApply(data);
  };

  /**
   * Get coupon details by code
   * @param code - Coupon code
   * @returns Coupon details
   */
  const getCouponDetails = async (code: string) => {
    return await couponService.getCouponDetails(code);
  };

  /**
   * Calculate discount amount based on coupon type
   * @param coupon - Coupon object
   * @param orderTotal - Order total amount
   * @returns Discount amount
   */
  const calculateDiscount = (coupon: Coupon, orderTotal: number): number => {
    if (coupon.discountType === "percentage") {
      return (orderTotal * coupon.discountValue) / 100;
    } else {
      // Fixed discount
      return coupon.discountValue;
    }
  };

  /**
   * Format coupon display text
   * @param coupon - Coupon object
   * @returns Formatted discount text
   */
  const formatDiscountText = (coupon: Coupon | MyCoupon): string => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}% off`;
    } else {
      return `৳${coupon.discountValue} off`;
    }
  };

  /**
   * Check if coupon is expired
   * @param validUntil - ISO date string
   * @returns true if expired
   */
  const isExpired = (validUntil: string): boolean => {
    return new Date(validUntil) < new Date();
  };

  return {
    validateCouponCode,
    fetchCustomerCoupons,
    fetchAutoApplyCoupon,
    getCouponDetails,
    calculateDiscount,
    formatDiscountText,
    isExpired,
  };
};
