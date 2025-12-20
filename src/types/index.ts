export interface Category {
  Category_ID: number;
  Category_Image: string;
  Category_Name: string;
  category_images: { name: string; type: string; url: string }[] | null;
  parent_category_id: number | null;
  sort_order: number;
}

export interface ProductImage {
  Image_ID?: number;
  Image_URL?: string;
  image_url?: string;
  MainImage?: boolean;
  Product_ID?: number;
  position?: string;
  sort_order?: number;
  title?: string;
}

export interface ProductMark {
  Mark_Name: string;
  color_code: string;
}

export interface Product {
  id: number;
  images: ProductImage[];
  marks: ProductMark[];
  name: string;
  old_price: number | null;
  price: number;
}

export interface Pagination {
  current_page: number;
  has_next: boolean;
  has_prev: boolean;
  per_page: number;
  total_pages: number;
  total_products: number;
}

export interface SpecialProjectParameters {
  project_name_value?: string;
  telegram_header_link_value?: string;
  footer_link_description?: string;
  footer_link_value?: string;
  [key: string]: string | undefined;
}

export interface SpecialProjectParametersJson {
  fast_search_strings?: {
    parameters_list: string[];
  };
  [key: string]: unknown;
}

export interface Banner {
  id: number;
  action_type: string;
  description: string;
  image_url: string;
  sort_order: number;
  url: string | null;
  extra_field_1?: string;
  extra_field_2?: string;
}

export interface ApiResponse {
  categories: Category[];
  products: Product[];
  pagination: Pagination;
  special_project_parameters: SpecialProjectParameters;
  special_project_parameters_json: SpecialProjectParametersJson;
  special_project_parameters_actions: Banner[];
  id_mark_for_sale?: number;
  status: string;
}

