import { IProductRepository, IOrderRepository, IStorageService } from './interfaces';
import { productRepository } from './product-repository';
import { orderRepository } from './order-repository';
import { D1ProductRepository, D1OrderRepository, R2StorageService, D1DatabaseBinding, R2BucketBinding } from './adapters/cloudflare';
import { MockStorageService } from '../services/storage';

export type DBProvider = 'mock' | 'd1' | 'postgres' | 'supabase';
export type StorageProvider = 'mock' | 'r2' | 's3';

export function getProductRepository(d1Binding?: D1DatabaseBinding): IProductRepository {
  const provider = (process.env.DB_PROVIDER || 'mock').toLowerCase() as DBProvider;

  switch (provider) {
    case 'd1':
      return new D1ProductRepository(d1Binding);
    case 'postgres':
    case 'supabase':
      return productRepository;
    case 'mock':
    default:
      return productRepository;
  }
}

export function getOrderRepository(d1Binding?: D1DatabaseBinding): IOrderRepository {
  const provider = (process.env.DB_PROVIDER || 'mock').toLowerCase() as DBProvider;

  switch (provider) {
    case 'd1':
      return new D1OrderRepository(d1Binding);
    case 'postgres':
    case 'supabase':
      return orderRepository;
    case 'mock':
    default:
      return orderRepository;
  }
}

export function getStorageService(r2Binding?: R2BucketBinding): IStorageService {
  const provider = (process.env.STORAGE_PROVIDER || 'mock').toLowerCase() as StorageProvider;

  switch (provider) {
    case 'r2':
      return new R2StorageService(r2Binding);
    case 's3':
      return new MockStorageService();
    case 'mock':
    default:
      return new MockStorageService();
  }
}
