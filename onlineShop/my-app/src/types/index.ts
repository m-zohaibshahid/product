export interface Product {
  product_id: number;
  article_code: string;
  name: string;
  description?: string;
  brand_id: number;
  category_id: number;
  default_tax_rate: number;
  status: 'active' | 'discontinued';
  brand?: Brand;
  category?: Category;
  variants?: ProductVariant[];
  images?: Image[];
}

export interface Brand {
  brand_id: number;
  name: string;
}

export interface Category {
  category_id: number;
  name: string;
}

export interface ProductVariant {
  variant_id: number;
  product_id: number;
  color_id: number;
  size_id: number;
  sku: string;
  selling_price: number;
  mrp?: number;
  product?: Product;
  color?: Color;
  size?: Size;
}

export interface Color {
  color_id: number;
  name: string;
  code?: string;
}

export interface Size {
  size_id: number;
  name: string;
}

export interface Image {
  image_id: number;
  image_path: string;
  image_url?: string;
  is_primary: boolean;
}

export interface Stock {
  stock_id: number;
  variant_id: number;
  quantity_on_hand: number;
  quantity_reserved: number;
  location?: Location;
}

export interface Location {
  location_id: number;
  name: string;
  type: 'store' | 'warehouse' | 'counter';
}

export interface Customer {
  customer_id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface CartItem {
  variant_id: number;
  variant: ProductVariant;
  quantity: number;
  unit_price: number;
}

export interface Order {
  order_id: number;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed';
  lines?: OrderLine[];
}

export interface OrderLine {
  variant_id: number;
  quantity: number;
  unit_price: number;
  variant?: ProductVariant;
}

