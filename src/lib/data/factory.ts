import { IProductRepository, IOrderRepository, IStorageService } from './interfaces';
import { productRepository } from './product-repository';
import { orderRepository } from './order-repository';
import { MockStorageService } from '../services/storage';

export function getProductRepository(): IProductRepository {
  return productRepository;
}

export function getOrderRepository(): IOrderRepository {
  return orderRepository;
}

export function getStorageService(): IStorageService {
  return new MockStorageService();
}
