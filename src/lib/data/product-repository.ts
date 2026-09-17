import { Product, CategoryId } from '@/types';
import { SAMPLE_PRODUCTS } from './sample-products';

export interface IProductRepository {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getProductsByCategory(category: CategoryId): Promise<Product[]>;
  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product | null>;
  deleteProduct(id: string): Promise<boolean>;
}

export class MockProductRepository implements IProductRepository {
  private products: Product[] = [...SAMPLE_PRODUCTS];

  async getAllProducts(): Promise<Product[]> {
    return [...this.products];
  }

  async getProductById(id: string): Promise<Product | null> {
    const product = this.products.find((p) => p.id === id);
    return product ? { ...product } : null;
  }

  async getProductsByCategory(category: CategoryId): Promise<Product[]> {
    return this.products.filter((p) => p.category === category);
  }

  async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    this.products.push(newProduct);
    return { ...newProduct };
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return { ...this.products[index] };
  }

  async deleteProduct(id: string): Promise<boolean> {
    const initialLength = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    return this.products.length < initialLength;
  }
}

// Singleton instance for in-memory persistence during application runtime
export const productRepository: IProductRepository = new MockProductRepository();
