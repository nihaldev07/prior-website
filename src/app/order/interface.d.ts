// types/order.ts

export interface Variation {
  color: string | null;
  size: string | null;
}

export interface Product {
  id: string;
  name: string;
  thumbnail: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variation: Variation | null;
}

export interface Customer {
  name: string;
  email: string | null;
  phoneNumber: string;
}

export interface Shipping {
  division: string;
  district: string;
  address: string;
}

export interface DeliveryTimelineItem {
  status: string;
  timestamp: Date;
  location: string;
  remarks: string;
  updatedBy: string;
}

export interface Courier {
  provider: string | null;
  consignmentId: string | null;
  trackingCode: string | null;
  invoice: string | null;
  createdAt: Date | null;
}

export interface CourierDeliveryHistory {
  provider: string;
  consignmentId: string;
  trackingCode: string;
  invoice: string;
  deliveryStatus: string;
  providerRawStatus: string;
  deliveryManId: string;
  deliveryManName: string;
  deliveryManPhone: string;
  statusHistory: DeliveryTimelineItem[];
  createdAt: Date;
}

export interface Order {
  id: string;
  orderNumber: number;
  customer: Customer;
  shipping: Shipping;
  products: Product[];
  totalPrice: number;
  paid: number;
  discount: number;
  deliveryCharge: number;
  remaining: number;
  status: string;
  notes: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  courier: Courier;
  deliveryStatus: string;
  deliveryTimeline: DeliveryTimelineItem[];
  estimatedDeliveryDate: Date | null;
  courierDeliveryHistory: CourierDeliveryHistory | null;
}
