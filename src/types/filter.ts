import { Category } from "@/data/types";

export interface FilterData {
  categoryId: string;
  color: string;
  size: string;
  price: string;
}

export interface FilterProps {
  sizes: string[];
  colors: string[];
  categories: Category[];
  filterData: FilterData;
  handleFilterChange: (filterData: FilterData) => void;
}

export interface ProductFetchParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  color?: string;
  size?: string;
  price?: string;
}
