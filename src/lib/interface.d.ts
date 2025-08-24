export interface INavItem {
  id: number;
  title: string;
  link: string;
  icon: string;
}

interface IProduct {
  id?: number; // or string, depending on your ID type
  name?: string;
  slug?: string;
  description?: string;
  discount?: number;
  discountType?: string;
  quantity?: number;
  unitPrice?: number;
  hasDiscount?: boolean;
  updatedPrice?: number;
  thumbnail?: string;
  images?: string[];
  categoryId?: string; // or string, depending on your category ID type
  productCode?: string;
  hasVariation?: boolean;
  sku?: string;
  variation?: Variation[]; // Define Variation interface if needed
  rating?: number;
  ratingDetails?: any; // Define RatingDetails interface if needed
}

interface ICategory {
  name?: string;
  img?: string;
}

interface IVariation {
  // Define the structure of a variation if applicable
  // For example:
  id?: number;
  name?: string;
  value?: string;
  size?: string;
  color?: string;
  quantity?: number;
}

interface IRatingDetails {
  // Define the structure of rating details if applicable
  averageRating?: number;
  numberOfReviews?: number;
}

// Example usage of the interfaces
interface IProductDetailsProps {
  product?: Product;
  category?: Category;
}

export interface ICampaingProducts {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  quantity: number;
  active: boolean;
  unitPrice: number;
}
export interface ICampaign {
  id: string;
  title: string;
  description: string;
  image?: string; // Optional since the image is not required
  products: ICampaingProducts[]; // Assuming Product interface is defined
  discount: number;
  discountType?: string; // Optional with default '%'
  startDate: string;
  endDate: string;
  active?: boolean; // Optional with default true
}
