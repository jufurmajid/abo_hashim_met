import { Order, OrderStatus, CreateOrderDTO } from '@/types';
import { productRepository } from './product-repository';

export interface IOrderRepository {
  createOrder(dto: CreateOrderDTO): Promise<Order>;
  getOrderById(id: string): Promise<Order | null>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null>;
}

export class MockOrderRepository implements IOrderRepository {
  private orders: Order[] = [];

  async createOrder(dto: CreateOrderDTO): Promise<Order> {
    const products = await productRepository.getAllProducts();
    const items = [];
    let total = 0;

    for (const itemDto of dto.items) {
      if (itemDto.quantity <= 0) {
        throw new Error('كمية المنتج يجب أن تكون أكبر من صفر');
      }

      const product = products.find((p) => p.id === itemDto.productId);
      if (!product) {
        throw new Error(`المنتج بـ ID ${itemDto.productId} غير موجود`);
      }

      // Synchronous Atomic Stock Check and Decrement
      if (!product.isAvailable || product.stock < itemDto.quantity) {
        throw new Error(`المنتج ${product.name} لم تعد الكمية المطلوبة متوفرة بالمخزون بسبب طلب آخر متزامن`);
      }

      // Deduct stock atomically
      product.stock -= itemDto.quantity;
      if (product.stock <= 0) {
        product.isAvailable = false;
      }

      const subtotal = product.price * itemDto.quantity;
      total += subtotal;

      items.push({
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity: itemDto.quantity,
        subtotal,
        unit: product.unit,
      });
    }

    const now = new Date().toISOString();
    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      customerName: dto.customer.fullName,
      phone: dto.customer.phone,
      governorate: dto.customer.governorate,
      area: dto.customer.area,
      address: dto.customer.address,
      landmark: dto.customer.landmark,
      notes: dto.customer.notes,
      items,
      total,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    this.orders.unshift(newOrder);
    return { ...newOrder };
  }

  async getOrderById(id: string): Promise<Order | null> {
    const order = this.orders.find((o) => o.id === id);
    return order ? { ...order } : null;
  }

  async getAllOrders(): Promise<Order[]> {
    return [...this.orders];
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const order = this.orders.find((o) => o.id === id);
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date().toISOString();
    return { ...order };
  }
}

export const orderRepository: IOrderRepository = new MockOrderRepository();
