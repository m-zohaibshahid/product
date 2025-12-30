// Common Types for Cloth Inventory System

export interface Brand {
  brand_id: number;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Category {
  category_id: number;
  name: string;
  description?: string;
}

export interface SubCategory {
  subcategory_id: number;
  category_id: number;
  name: string;
  description?: string;
  category?: Category;
}

export interface Color {
  color_id: number;
  name: string;
  code?: string;
}

export interface Size {
  size_id: number;
  name: string;
  size_order: number;
}

export interface Product {
  product_id: number;
  article_code: string;
  name: string;
  description?: string;
  brand_id: number;
  category_id: number;
  subcategory_id?: number;
  default_tax_rate: number;
  status: 'active' | 'discontinued';
  created_at: string;
  updated_at: string;
  brand?: Brand;
  category?: Category;
  subcategory?: SubCategory;
  variants?: ProductVariant[];
  images?: Image[];
}

export interface ProductVariant {
  variant_id: number;
  product_id: number;
  color_id: number;
  size_id: number;
  sku: string;
  barcode?: string;
  cost_price: number;
  selling_price: number;
  mrp?: number;
  status: 'active' | 'inactive';
  min_stock_level: number;
  max_stock_level?: number;
  created_at: string;
  updated_at: string;
  product?: Product;
  color?: Color;
  size?: Size;
  images?: Image[];
}

export interface Image {
  image_id: number;
  entity_type: 'product' | 'variant' | 'brand' | 'category' | 'subcategory' | 'supplier';
  entity_id: number;
  image_path: string;
  image_url?: string;
  image_type: 'main' | 'thumbnail' | 'gallery' | 'logo';
  display_order: number;
  alt_text?: string;
  file_size?: number;
  mime_type?: string;
  is_primary: boolean;
  uploaded_by?: number;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  supplier_id: number;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  tax_id?: string;
  status: 'active' | 'inactive';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Location {
  location_id: number;
  name: string;
  type: 'store' | 'warehouse' | 'counter';
  address?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Stock {
  stock_id: number;
  location_id: number;
  variant_id: number;
  quantity_on_hand: number;
  quantity_reserved: number;
  last_updated_at: string;
  location?: Location;
  variant?: ProductVariant;
}

export interface PurchaseOrder {
  po_id: number;
  supplier_id: number;
  po_number: string;
  order_date: string;
  expected_delivery_date?: string;
  status: 'draft' | 'ordered' | 'partially_received' | 'fully_received' | 'cancelled';
  total_amount: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  supplier?: Supplier;
  lines?: PurchaseOrderLine[];
}

export interface PurchaseOrderLine {
  po_line_id: number;
  po_id: number;
  variant_id: number;
  ordered_qty: number;
  received_qty: number;
  unit_cost: number;
  tax_rate: number;
  discount: number;
  variant?: ProductVariant;
}

export interface Sale {
  sale_id: number;
  invoice_number: string;
  sale_date: string;
  location_id: number;
  customer_id?: number;
  subtotal_amount: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  payment_status: 'paid' | 'partial' | 'unpaid';
  created_by: number;
  created_at: string;
  location?: Location;
  lines?: SaleLine[];
  payments?: Payment[];
}

export interface SaleLine {
  sale_line_id: number;
  sale_id: number;
  variant_id: number;
  quantity: number;
  unit_price: number;
  discount: number;
  tax_rate: number;
  variant?: ProductVariant;
}

export interface Payment {
  payment_id: number;
  sale_id: number;
  payment_date: string;
  payment_method: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'cheque';
  amount: number;
  reference_number?: string;
  received_by: number;
}

// Auth Types
export interface Role {
  role_id: number;
  name: string;
  description?: string;
}

export interface User {
  user_id: number;
  username: string;
  full_name?: string;
  role_id: number;
  status: 'active' | 'inactive';
  created_at: string;
  role?: Role;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  full_name?: string;
  role_id: number;
}

export interface LoginResponse {
  access_token: string;
  user: User;
  message: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

// Customer Types
export interface Customer {
  customer_id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CustomerRegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export interface CustomerLoginRequest {
  email: string;
  password: string;
}

export interface CustomerLoginResponse {
  access_token: string;
  customer: Customer;
  message: string;
}

export interface CustomerRegisterResponse {
  message: string;
  customer: Customer;
}

// Order Types
export interface Order {
  order_id: number;
  order_number: string;
  order_date: string;
  location_id: number;
  customer_id?: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  order_type: 'online' | 'offline';
  subtotal_amount: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  payment_method?: 'cod' | 'card' | 'upi' | 'bank_transfer' | 'wallet';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping_address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  location?: Location;
  customer?: Customer;
  lines?: OrderLine[];
  sale?: Sale;
}

export interface OrderLine {
  order_line_id: number;
  order_id: number;
  variant_id: number;
  quantity: number;
  unit_price: number;
  discount: number;
  tax_rate: number;
  variant?: ProductVariant;
}

export interface CreateOrderRequest {
  order_date: string;
  location_id: number;
  customer_id?: number;
  order_type?: 'online' | 'offline';
  lines: CreateOrderLineRequest[];
  discount_amount?: number;
  payment_method?: 'cod' | 'card' | 'upi' | 'bank_transfer' | 'wallet';
  shipping_address?: string;
  notes?: string;
}

export interface CreateOrderLineRequest {
  variant_id: number;
  quantity: number;
  unit_price: number;
  discount?: number;
  tax_rate?: number;
}

export interface ConfirmOrderRequest {
  payment_method: 'cod' | 'card' | 'upi' | 'bank_transfer' | 'wallet';
  shipping_address?: string;
  notes?: string;
}

export interface ProcessPaymentRequest {
  payment_reference?: string;
  payment_date?: string;
}

// Cart Types
export interface CartItem {
  variant_id: number;
  variant: ProductVariant;
  quantity: number;
  unit_price: number;
  discount?: number;
  tax_rate?: number;
}




