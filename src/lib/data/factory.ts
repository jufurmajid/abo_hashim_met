import { IProductRepository, IOrderRepository, IStorageService } from './interfaces';
import { productRepository } from './product-repository';
import { orderRepository } from './order-repository';
import { D1ProductRepository, D1OrderRepository, R2StorageService } from './adapters/cloudflare';
import { MockStorageService } from '../services/storage';

export type DBProvider = 'mock' | 'd1' | 'postgres' | 'supabase';
export type StorageProvider = 'mock' | 'r2' | 's3';

export function getProductRepository(): IProductRepository {
  const provider = (process.env.DB_PROVIDER || 'mock').toLowerCase() as DBProvider;

  switch (provider) {
    case 'd1':
      return new D1ProductRepository();
    case 'postgres':
    case 'supabase':
      // Future adapter instantiation: return new PostgresProductRepository();
      return productRepository;
    case 'mock':
    default:
      return productRepository;
  }
}

export function getOrderRepository(): IOrderRepository {
  const provider = (process.env.DB_PROVIDER || 'mock').toLowerCase() as DBProvider;

  switch (provider) {
    case 'd1':
      return new D1OrderRepository();
    case 'postgres':
    case 'supabase':
      // Future adapter instantiation: return new PostgresOrderRepository();
      return orderRepository;
    case 'mock':
    default:
      return orderRepository;
  }
}

export function getStorageService(): IStorageService {
  const provider = (process.env.STORAGE_PROVIDER || 'mock').toLowerCase() as StorageProvider;

  switch (provider) {
    case 'r2':
      return new R2StorageService();
    case 's3':
      // Future adapter instantiation: return new S3StorageService();
      return new MockStorageService();
    case 'mock':
    default:
      return new MockStorageService();
  }
}
