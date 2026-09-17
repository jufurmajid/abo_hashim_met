import { Product, Order, OrderStatus, CreateOrderDTO } from '@/types';
import { IProductRepository, IOrderRepository, IStorageService } from '../interfaces';
import { productRepository } from '../product-repository';
import { orderRepository } from '../order-repository';

export class D1ProductRepository implements IProductRepository {
  private fallbackRepo: IProductRepository = productRepository;

  async getAllProducts(): Promise<Product[]> {
    return this.fallbackRepo.getAllProducts();
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.fallbackRepo.getProductById(id);
  }

  async getProductsByCategory(category: Parameters<IProductRepository['getProductsByCategory']>[0]): Promise<Product[]> {
    return this.fallbackRepo.getProductsByCategory(category);
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    return this.fallbackRepo.createProduct(product);
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product | null> {
    return this.fallbackRepo.updateProduct(id, product);
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.fallbackRepo.deleteProduct(id);
  }
}

export class D1OrderRepository implements IOrderRepository {
  private fallbackRepo: IOrderRepository = orderRepository;

  async createOrder(dto: CreateOrderDTO): Promise<Order> {
    return this.fallbackRepo.createOrder(dto);
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.fallbackRepo.getOrderById(id);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.fallbackRepo.getAllOrders();
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    return this.fallbackRepo.updateOrderStatus(id, status);
  }
}

export class R2StorageService implements IStorageService {
  async uploadImage(file: File | Buffer, filename: string): Promise<string> {
    console.log(`[Cloudflare R2 Adapter] Uploading ${filename}`);
    return `https://r2-bucket.placeholder.com/products/${filename}`;
  }

  async deleteImage(fileUrl: string): Promise<boolean> {
    console.log(`[Cloudflare R2 Adapter] Deleting image ${fileUrl}`);
    return true;
  }
}
