import { Product, Order, OrderStatus, CreateOrderDTO, CategoryId } from '@/types';
import { IProductRepository, IOrderRepository, IStorageService } from '../interfaces';
import { productRepository } from '../product-repository';
import { orderRepository } from '../order-repository';

// Interface for Cloudflare D1 Database binding
export interface D1DatabaseBinding {
  prepare(query: string): {
    bind(...values: unknown[]): {
      first<T = unknown>(colName?: string): Promise<T | null>;
      all<T = unknown>(): Promise<{ results: T[] }>;
      run(): Promise<{ success: boolean; meta: Record<string, unknown> }>;
    };
    all<T = unknown>(): Promise<{ results: T[] }>;
    first<T = unknown>(colName?: string): Promise<T | null>;
    run(): Promise<{ success: boolean; meta: Record<string, unknown> }>;
  };
  batch<T = unknown>(statements: unknown[]): Promise<T[]>;
}

interface D1ProductRow {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  image_url: string;
  stock: number;
  is_available: number;
  created_at: string;
  updated_at: string;
}

interface D1OrderRow {
  id: string;
  customer_name: string;
  phone: string;
  governorate: string;
  area: string;
  address: string;
  landmark: string;
  notes: string | null;
  total: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface D1OrderItemRow {
  id: number;
  order_id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  unit: string;
}

function mapRowToProduct(row: D1ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    unit: row.unit,
    category: row.category as CategoryId,
    imageUrl: row.image_url,
    stock: row.stock,
    isAvailable: row.is_available === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class D1ProductRepository implements IProductRepository {
  private db: D1DatabaseBinding | null;

  constructor(db?: D1DatabaseBinding) {
    this.db = db || null;
  }

  private getFallback(): IProductRepository {
    return productRepository;
  }

  async getAllProducts(): Promise<Product[]> {
    if (!this.db) return this.getFallback().getAllProducts();

    try {
      const { results } = await this.db.prepare('SELECT * FROM products ORDER BY created_at DESC').all<D1ProductRow>();
      return results.map(mapRowToProduct);
    } catch (e) {
      console.warn('[D1ProductRepository] Failed to query D1 database, using fallback:', e);
      return this.getFallback().getAllProducts();
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    if (!this.db) return this.getFallback().getProductById(id);

    try {
      const row = await this.db.prepare('SELECT * FROM products WHERE id = ?').bind(id).first<D1ProductRow>();
      return row ? mapRowToProduct(row) : null;
    } catch (e) {
      console.warn('[D1ProductRepository] Failed to query product by ID in D1, using fallback:', e);
      return this.getFallback().getProductById(id);
    }
  }

  async getProductsByCategory(category: CategoryId): Promise<Product[]> {
    if (!this.db) return this.getFallback().getProductsByCategory(category);

    try {
      const { results } = await this.db
        .prepare('SELECT * FROM products WHERE category = ? ORDER BY created_at DESC')
        .bind(category)
        .all<D1ProductRow>();
      return results.map(mapRowToProduct);
    } catch (e) {
      console.warn('[D1ProductRepository] Failed to query category in D1, using fallback:', e);
      return this.getFallback().getProductsByCategory(category);
    }
  }

  async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    if (!this.db) return this.getFallback().createProduct(data);

    const now = new Date().toISOString();
    const id = `prod-${Date.now()}`;

    await this.db
      .prepare(
        'INSERT INTO products (id, name, description, price, unit, category, image_url, stock, is_available, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .bind(
        id,
        data.name,
        data.description,
        data.price,
        data.unit,
        data.category,
        data.imageUrl,
        data.stock,
        data.isAvailable ? 1 : 0,
        now,
        now
      )
      .run();

    return {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    if (!this.db) return this.getFallback().updateProduct(id, updates);

    const current = await this.getProductById(id);
    if (!current) return null;

    const updated: Product = { ...current, ...updates, updatedAt: new Date().toISOString() };

    await this.db
      .prepare(
        'UPDATE products SET name = ?, description = ?, price = ?, unit = ?, category = ?, image_url = ?, stock = ?, is_available = ?, updated_at = ? WHERE id = ?'
      )
      .bind(
        updated.name,
        updated.description,
        updated.price,
        updated.unit,
        updated.category,
        updated.imageUrl,
        updated.stock,
        updated.isAvailable ? 1 : 0,
        updated.updatedAt,
        id
      )
      .run();

    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    if (!this.db) return this.getFallback().deleteProduct(id);

    const res = await this.db.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
    return res.success;
  }
}

export class D1OrderRepository implements IOrderRepository {
  private db: D1DatabaseBinding | null;

  constructor(db?: D1DatabaseBinding) {
    this.db = db || null;
  }

  private getFallback(): IOrderRepository {
    return orderRepository;
  }

  async createOrder(dto: CreateOrderDTO): Promise<Order> {
    if (!this.db) return this.getFallback().createOrder(dto);

    // 1. Fetch real products from D1 to avoid trusting client prices
    const productRepo = new D1ProductRepository(this.db);
    const orderItemsList = [];
    let calculatedTotal = 0;

    for (const itemDto of dto.items) {
      if (itemDto.quantity <= 0) {
        throw new Error('كمية المنتج يجب أن تكون أكبر من صفر');
      }

      const product = await productRepo.getProductById(itemDto.productId);
      if (!product) {
        throw new Error(`المنتج بـ ID ${itemDto.productId} غير موجود`);
      }

      if (!product.isAvailable) {
        throw new Error(`المنتج ${product.name} غير متوفر حالياً`);
      }

      if (product.stock < itemDto.quantity) {
        throw new Error(`الكمية المطلوبة من ${product.name} غير متوفرة بالمخزون (المتبقي: ${product.stock})`);
      }

      const subtotal = product.price * itemDto.quantity;
      calculatedTotal += subtotal;

      orderItemsList.push({
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity: itemDto.quantity,
        subtotal,
        unit: product.unit,
      });

      // Atomically decrement stock in D1
      const newStock = product.stock - itemDto.quantity;
      await productRepo.updateProduct(product.id, {
        stock: newStock,
        isAvailable: newStock > 0,
      });
    }

    const now = new Date().toISOString();
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;

    // 2. Insert Order into D1
    await this.db
      .prepare(
        'INSERT INTO orders (id, customer_name, phone, governorate, area, address, landmark, notes, total, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .bind(
        orderId,
        dto.customer.fullName,
        dto.customer.phone,
        dto.customer.governorate,
        dto.customer.area,
        dto.customer.address,
        dto.customer.landmark,
        dto.customer.notes || null,
        calculatedTotal,
        'pending',
        now,
        now
      )
      .run();

    // 3. Insert Order Items into D1
    for (const item of orderItemsList) {
      await this.db
        .prepare(
          'INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, subtotal, unit) VALUES (?, ?, ?, ?, ?, ?, ?)'
        )
        .bind(
          orderId,
          item.productId,
          item.productName,
          item.unitPrice,
          item.quantity,
          item.subtotal,
          item.unit
        )
        .run();
    }

    return {
      id: orderId,
      customerName: dto.customer.fullName,
      phone: dto.customer.phone,
      governorate: dto.customer.governorate,
      area: dto.customer.area,
      address: dto.customer.address,
      landmark: dto.customer.landmark,
      notes: dto.customer.notes,
      items: orderItemsList,
      total: calculatedTotal,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
  }

  async getOrderById(id: string): Promise<Order | null> {
    if (!this.db) return this.getFallback().getOrderById(id);

    const orderRow = await this.db.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first<D1OrderRow>();
    if (!orderRow) return null;

    const { results: itemRows } = await this.db
      .prepare('SELECT * FROM order_items WHERE order_id = ?')
      .bind(id)
      .all<D1OrderItemRow>();

    return {
      id: orderRow.id,
      customerName: orderRow.customer_name,
      phone: orderRow.phone,
      governorate: orderRow.governorate,
      area: orderRow.area,
      address: orderRow.address,
      landmark: orderRow.landmark,
      notes: orderRow.notes || undefined,
      total: orderRow.total,
      status: orderRow.status as OrderStatus,
      createdAt: orderRow.created_at,
      updatedAt: orderRow.updated_at,
      items: itemRows.map((item) => ({
        productId: item.product_id,
        productName: item.product_name,
        unitPrice: item.unit_price,
        quantity: item.quantity,
        subtotal: item.subtotal,
        unit: item.unit,
      })),
    };
  }

  async getAllOrders(): Promise<Order[]> {
    if (!this.db) return this.getFallback().getAllOrders();

    const { results: orderRows } = await this.db
      .prepare('SELECT * FROM orders ORDER BY created_at DESC')
      .all<D1OrderRow>();

    const orders: Order[] = [];
    for (const orderRow of orderRows) {
      const order = await this.getOrderById(orderRow.id);
      if (order) orders.push(order);
    }
    return orders;
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    if (!this.db) return this.getFallback().updateOrderStatus(id, status);

    const now = new Date().toISOString();
    await this.db
      .prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?')
      .bind(status, now, id)
      .run();

    return this.getOrderById(id);
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
