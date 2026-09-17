export type CategoryId = 'meats' | 'dairy' | 'cheese' | 'other';

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string; // e.g., 'كغم', 'علبة', 'قطعة'
  category: CategoryId;
  imageUrl: string;
  stock: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Customer {
  fullName: string;
  phone: string;
  governorate: string;
  area: string;
  address: string;
  landmark: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  unit: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  governorate: string;
  area: string;
  address: string;
  landmark: string;
  notes?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDTO {
  customer: Customer;
  items: {
    productId: string;
    quantity: number;
  }[];
}
