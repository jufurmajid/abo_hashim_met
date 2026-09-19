import { Order, OrderStatus } from '@/types';
import { sendTelegramMessage, editTelegramMessage, TelegramInlineButton } from './telegram';

export interface ITelegramOrderService {
  sendNewOrderNotification(order: Order, chatId?: string): Promise<boolean>;
  sendOrderStatusUpdate(order: Order, newStatus: OrderStatus, messageId?: number, chatId?: string): Promise<boolean>;
  formatOrderMessage(order: Order): string;
}

export class TelegramOrderService implements ITelegramOrderService {
  private customBotToken?: string;
  private customDefaultChatId?: string;

  constructor(botToken?: string, defaultChatId?: string) {
    this.customBotToken = botToken;
    this.customDefaultChatId = defaultChatId;
  }

  private get botToken(): string {
    return this.customBotToken || process.env.TELEGRAM_ORDERS_BOT_TOKEN || 'your_orders_bot_token_here';
  }

  private get defaultChatId(): string {
    return this.customDefaultChatId || process.env.TELEGRAM_ORDERS_CHAT_ID || 'your_orders_chat_id_here';
  }

  formatOrderMessage(order: Order): string {
    const itemsList = order.items
      .map((item) => `• *${item.productName}* × ${item.quantity} (${item.subtotal.toLocaleString('ar-IQ')} د.ع)`)
      .join('\n');

    const statusBadge = this.getStatusBadge(order.status);

    return (
      `🛍 *طلب جديد #${order.id}*\n` +
      `الحالة: ${statusBadge}\n\n` +
      `👤 *الزبون:* ${order.customerName}\n` +
      `📞 *الهاتف:* \`${order.phone}\`\n` +
      `📍 *العنوان:* ${order.governorate} - ${order.area} - ${order.address}\n` +
      `🗺 *أقرب نقطة دالة:* ${order.landmark}\n` +
      (order.notes ? `📝 *ملاحظات:* ${order.notes}\n` : '') +
      `\n🛒 *المنتجات المطلوبة:*\n${itemsList}\n\n` +
      `💰 *الإجمالي النهائي:* *${order.total.toLocaleString('ar-IQ')} د.ع*\n` +
      `⏰ *وقت الطلب:* ${new Date(order.createdAt).toLocaleString('ar-IQ')}`
    );
  }

  private getStatusBadge(status: OrderStatus): string {
    switch (status) {
      case 'pending':
        return '⏳ قيد الانتظار';
      case 'confirmed':
        return '✅ تم التأكيد';
      case 'preparing':
        return '👨‍🍳 قيد التحضير';
      case 'out_for_delivery':
        return '🚚 جاري التوصيل';
      case 'delivered':
        return '🎉 تم التسليم';
      case 'cancelled':
        return '❌ ملغي';
      default:
        return status;
    }
  }

  private getStatusKeyboard(orderId: string): TelegramInlineButton[][] {
    return [
      [
        { text: '✅ تأكيد', callback_data: `status:${orderId}:confirmed` },
        { text: '👨‍🍳 قيد التحضير', callback_data: `status:${orderId}:preparing` },
      ],
      [
        { text: '🚚 جاري التوصيل', callback_data: `status:${orderId}:out_for_delivery` },
        { text: '🎉 تم التسليم', callback_data: `status:${orderId}:delivered` },
      ],
      [{ text: '❌ إلغاء الطلب', callback_data: `status:${orderId}:cancelled` }],
    ];
  }

  async sendNewOrderNotification(order: Order, chatId?: string): Promise<boolean> {
    const targetChat = chatId || this.defaultChatId;
    const text = this.formatOrderMessage(order);
    const inlineKeyboard = this.getStatusKeyboard(order.id);

    return sendTelegramMessage({
      chatId: targetChat,
      text,
      botToken: this.botToken,
      parseMode: 'Markdown',
      inlineKeyboard,
    });
  }

  async sendOrderStatusUpdate(
    order: Order,
    newStatus: OrderStatus,
    messageId?: number,
    chatId?: string
  ): Promise<boolean> {
    const targetChat = chatId || this.defaultChatId;
    order.status = newStatus;
    const text = this.formatOrderMessage(order);
    const inlineKeyboard = this.getStatusKeyboard(order.id);

    if (messageId) {
      return editTelegramMessage({
        chatId: targetChat,
        messageId,
        text,
        botToken: this.botToken,
        parseMode: 'Markdown',
        inlineKeyboard,
      });
    }

    return sendTelegramMessage({
      chatId: targetChat,
      text: `🔄 *تحديث حالة الطلب #${order.id}*\n\nالحالة الجديدة: ${this.getStatusBadge(newStatus)}`,
      botToken: this.botToken,
      parseMode: 'Markdown',
    });
  }
}

export const telegramOrderService = new TelegramOrderService();
