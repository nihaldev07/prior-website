const hostName = "http://localhost:7001"; //"https://app.priorbd.com";
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
    getOrderDetails:(orderId:string)=>`${baseUrl}/order/details/${orderId}`
  },
  payment: {
    bkashCheckout: () => `${hostName}/bkash/bkash-checkout`,
    bkashCallback: () => `${hostName}/bkash/bkash-callback`,
  },
  contact:{
    createContactQuery:()=>`${baseUrl}/customer-service/contact`
  }
};