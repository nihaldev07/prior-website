const hostName =   "https://prior-express.onrender.com"; //"https://app.priorbd.com";
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
  },
  payment: {
    bkashCheckout: () => `${hostName}/bkash/bkash-checkout`,
    bkashCallback: () => `${hostName}/bkash/bkash-callback`,
  },
};