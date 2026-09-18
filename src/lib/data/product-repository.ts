import { Product, CategoryId } from '@/types';
import initialProductsData from '@/data/products.json';
import { syncFileToGitHub } from '../github';

export interface IProductRepository {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getProductsByCategory(category: CategoryId): Promise<Product[]>;
  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product | null>;
  deleteProduct(id: string): Promise<boolean>;
}

export class JsonProductRepository implements IProductRepository {
  private products: Product[];

  constructor() {
    this.products = (initialProductsData as Product[]) || [];
  }

  private async persistToGitHub(commitMessage: string): Promise<void> {
    try {
      await syncFileToGitHub({
        filePath: 'src/data/products.json',
        content: JSON.stringify(this.products, null, 2),
        commitMessage,
      });
    } catch (err) {
      console.error('[JsonProductRepository] Error pushing updates to GitHub:', err);
    }
  }

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
    await this.persistToGitHub(`إضافة منتج جديد: ${newProduct.name} (${newProduct.id})`);
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
    const updatedProduct = { ...this.products[index] };
    await this.persistToGitHub(`تحديث بيانات المنتج: ${updatedProduct.name} (${updatedProduct.id})`);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return false;

    const [deleted] = this.products.splice(index, 1);
    await this.persistToGitHub(`حذف المنتج: ${deleted.name} (${deleted.id})`);
    return true;
  }
}

// Singleton instance for runtime usage across store requests
export const productRepository: IProductRepository = new JsonProductRepository();
export const MockProductRepository = JsonProductRepository;
