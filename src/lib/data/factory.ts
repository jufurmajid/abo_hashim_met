import { IProductRepository, IOrderRepository, IStorageService } from './interfaces';
import { productRepository } from './product-repository';
import { orderRepository } from './order-repository';
import { D1ProductRepository, D1OrderRepository, R2StorageService, D1DatabaseBinding, R2BucketBinding } from './adapters/cloudflare';
import { MockStorageService } from '../services/storage';

export type DBProvider = 'mock' | 'd1' | 'postgres' | 'supabase';
export type StorageProvider = 'mock' | 'r2' | 's3';

// Helper to safely extract Cloudflare Environment bindings from OpenNext or globalThis
function getCloudflareBindings(): { DB?: D1DatabaseBinding; R2_BUCKET?: R2BucketBinding } {
  if (typeof globalThis !== 'undefined') {
    // OpenNext Cloudflare Context binding lookup
    const globalContext = globalThis as unknown as {
      __cloudflare_context__?: { env?: { DB?: D1DatabaseBinding; R2_BUCKET?: R2BucketBinding } };
      DB?: D1DatabaseBinding;
      R2_BUCKET?: R2BucketBinding;
    };

    if (globalContext.__cloudflare_context__?.env?.DB) {
      return globalContext.__cloudflare_context__.env;
    }
    if (globalContext.DB) {
      return { DB: globalContext.DB, R2_BUCKET: globalContext.R2_BUCKET };
    }
  }
  return {};
}

export function getProductRepository(d1Binding?: D1DatabaseBinding): IProductRepository {
  const provider = (process.env.DB_PROVIDER || 'mock').toLowerCase() as DBProvider;

  switch (provider) {
    case 'd1': {
      const db = d1Binding || getCloudflareBindings().DB;
      return new D1ProductRepository(db);
    }
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
    case 'd1': {
      const db = d1Binding || getCloudflareBindings().DB;
      return new D1OrderRepository(db);
    }
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
    case 'r2': {
      const bucket = r2Binding || getCloudflareBindings().R2_BUCKET;
      return new R2StorageService(bucket);
    }
    case 's3':
      return new MockStorageService();
    case 'mock':
    default:
      return new MockStorageService();
  }
}
