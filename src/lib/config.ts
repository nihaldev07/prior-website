const hostName = "https://app.priorbd.com";
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
    checkPrepayment: () => `${baseUrl}/campaign//check-campaign-product`,
    calculatePrepayment: () => `${baseUrl}/campaign/calculate-prepayment`,
  },
};
