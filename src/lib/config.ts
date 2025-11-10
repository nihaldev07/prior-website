const hostName = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = `${hostName}/prior`;

export const config = {
  product: {
    getProductById: (id: string) => `${baseUrl}/product/by/${id}`,
    getProducts: () => `${baseUrl}/product/all`,
    getCategories: () => `${baseUrl}/product/categories`,
    getProductsByCategory: (id: string) => `${baseUrl}/product/category/${id}`,
    getBestProducts: () => `${baseUrl}/product/best`,
    getNewProducts: () => `${baseUrl}/product/latest`,
    getFilterData: () => `${baseUrl}/product/filterData`,
    searchProducts: () => `${baseUrl}/product/search`,
  },
  order: {
    createOrder: () => `${baseUrl}/order/create`,
    getOrderDetails: (orderId: string) => `${baseUrl}/order/details/${orderId}`,
  },
  customer: {
    orders: () => `${baseUrl}/customer/orders`,
    orderDetails: (orderId: string) => `${baseUrl}/customer/orders/${orderId}`,
    stats: () => `${baseUrl}/customer/stats`,
    wishlist: () => `${baseUrl}/customer/wishlist`,
    addToWishlist: () => `${baseUrl}/customer/wishlist/add`,
    removeFromWishlist: (itemId: string) =>
      `${baseUrl}/customer/wishlist/remove/${itemId}`,
    clearWishlist: () => `${baseUrl}/customer/wishlist/clear`,
    trackOrder: (orderId: string) =>
      `${baseUrl}/customer/orders/${orderId}/track`,
    reorder: (orderId: string) =>
      `${baseUrl}/customer/orders/${orderId}/reorder`,
    downloadInvoice: (orderId: string) =>
      `${baseUrl}/customer/orders/${orderId}/invoice`,
  },
  payment: {
    bkashCheckout: () => `${hostName}/bkash/bkash-checkout`,
    bkashCallback: () => `${hostName}/bkash/bkash-callback`,
  },
  contact: {
    createContactQuery: () => `${baseUrl}/customer-service/contact`,
  },
  campaign: {
    getActiveCampaign: () => `${baseUrl}/campaign/active`,
    getCampaignById: (id: string) => `${baseUrl}/campaign/active/${id}`,
    checkPrepayment: () => `${baseUrl}/campaign/check-campaign-product`,
    calculatePrepayment: () => `${baseUrl}/campaign/calculate-prepayment`,
  },
};
