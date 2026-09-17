import { Order, OrderStatus } from '@/types';

/**
 * Service interface for Telegram Orders Bot operations.
 * Will be implemented in Phase 2 using Telegram Bot API & Webhooks.
 */
export interface ITelegramOrderService {
  sendNewOrderNotification(order: Order): Promise<boolean>;
  sendOrderStatusUpdate(orderId: string, status: OrderStatus, customerPhone: string): Promise<boolean>;
  formatOrderMessage(order: Order): string;
}

export class MockTelegramOrderService implements ITelegramOrderService {
  formatOrderMessage(order: Order): string {
    const itemsList = order.items
      .map((item) => `• ${item.productName} × ${item.quantity} (${item.subtotal.toLocaleString('ar-IQ')} د.ع)`)
      .join('\n');

    return `🛍 **طلب جديد #${order.id}**\n\n` +
      `👤 **الزبون:** ${order.customerName}\n` +
      `📞 **الهاتف:** ${order.phone}\n` +
      `📍 **العنوان:** ${order.governorate} - ${order.area} - ${order.address}\n` +
      `🗺 **أقرب نقطة دالة:** ${order.landmark}\n` +
      (order.notes ? `📝 **ملاحظات:** ${order.notes}\n` : '') +
      `\n🛒 **المنتجات:**\n${itemsList}\n\n` +
      `💰 **المجموع الإجمالي:** ${order.total.toLocaleString('ar-IQ')} د.ع\n` +
      `⏰ **التاريخ:** ${new Date(order.createdAt).toLocaleString('ar-IQ')}`;
  }

  async sendNewOrderNotification(order: Order): Promise<boolean> {
    console.log('[Mock Telegram Orders Service] Sending notification:\n', this.formatOrderMessage(order));
    return true;
  }

  async sendOrderStatusUpdate(orderId: string, status: OrderStatus): Promise<boolean> {
    console.log(`[Mock Telegram Orders Service] Order ${orderId} updated to status: ${status}`);
    return true;
  }
}
