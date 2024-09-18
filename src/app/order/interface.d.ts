// types/order.ts

export interface Variation {
  color?: string;
  size?: string;
}

export interface Product {
  id: string;
  productId: string;
  name: string;
  thumbnail: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
  hasVariation: boolean;
  variation: Variation;
}

export interface Customer {
  name: string;
  email?: string;
  phoneNumber: string;
}

export interface Shipping{
     division: string;
    district: string;
    address: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  customer: Customer;
  status: string;
  totalPrice: number;
  paid: number;
  discount: number;
  deliveryCharge: number;
  remaining: number;
  products: Product[];
  shipping:Shipping;
}
