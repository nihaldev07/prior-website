
export interface INavItem{
 id:number;
 title:string;
 link:string;
 icon:string
}

interface IProduct {
  id?: number; // or string, depending on your ID type
  name?: string;
  description?: string;
  discount?: number;
  quantity?: number;
  unitPrice?: number;
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
  size?:string;
  color?:string;
  quantity?:number;
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
