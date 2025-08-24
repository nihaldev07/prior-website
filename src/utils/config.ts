export const hostName = "https://app.priorbd.com";
const baseUrl = `${hostName}/prior`;

export const config = {
  product: {
    getProductById: (id: string) => `${baseUrl}/product/by/${id}`,
    getProducts: () => `${baseUrl}/product/all`,
    getProductsByCategory: (id: string) => `${baseUrl}/product/category/${id}`,
    getBestProducts: () => `${baseUrl}/product/best`,
    getFilterData: () => `${baseUrl}/product/filterData`,
    searchProducts: () => `${baseUrl}/product/search`,
  },
  order: {
    createOrder: () => `${baseUrl}/order/create`,
  },
  payment: {
    bkashCheckout: () => `${hostName}/bkash/bkash-checkout`,
    bkashCallback: () => `${hostName}/bkash/bkash-callback`,
  },
};
