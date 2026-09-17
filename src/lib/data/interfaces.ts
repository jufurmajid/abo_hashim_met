import { Product, CategoryId, Order, OrderStatus, CreateOrderDTO } from '@/types';

export interface IProductRepository {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getProductsByCategory(category: CategoryId): Promise<Product[]>;
  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product | null>;
  deleteProduct(id: string): Promise<boolean>;
}

export interface IOrderRepository {
  createOrder(dto: CreateOrderDTO): Promise<Order>;
  getOrderById(id: string): Promise<Order | null>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null>;
}

export interface IStorageService {
  uploadImage(file: File | Buffer, filename: string): Promise<string>;
  deleteImage(fileUrl: string): Promise<boolean>;
}
