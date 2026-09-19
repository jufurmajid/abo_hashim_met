import { getOrderRepository } from '@/lib/data/factory';
import { telegramOrderService } from '@/lib/services/telegram-order';
import { sendTelegramMessage, sanitizeLog } from '@/lib/services/telegram';
import { OrderStatus } from '@/types';

export async function POST(request: Request) {
  try {
    const update = await request.json();

    // Handle Telegram Inline Keyboard Callback Query
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const data = callbackQuery.data || ''; // e.g. "status:ORD-123456:confirmed"
      const message = callbackQuery.message;
      const chatId = String(message?.chat?.id || callbackQuery.from?.id).trim();

      // Verify authorization against TELEGRAM_ORDERS_CHAT_ID or TELEGRAM_ADMIN_CHAT_ID
      const authorizedOrdersChatId = process.env.TELEGRAM_ORDERS_CHAT_ID ? process.env.TELEGRAM_ORDERS_CHAT_ID.trim() : '';
      const authorizedAdminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID ? process.env.TELEGRAM_ADMIN_CHAT_ID.trim() : '';

      const isOrdersChatAuthorized = authorizedOrdersChatId && authorizedOrdersChatId !== 'your_orders_chat_id_here' && chatId === authorizedOrdersChatId;
      const isAdminChatAuthorized = authorizedAdminChatId && authorizedAdminChatId !== 'your_admin_chat_id_here' && chatId === authorizedAdminChatId;

      if ((authorizedOrdersChatId || authorizedAdminChatId) && !isOrdersChatAuthorized && !isAdminChatAuthorized) {
        console.warn(`[Orders Webhook API] Unauthorized order status update attempt from chatId: ${chatId}`);
        await sendTelegramMessage({
          chatId,
          text: '⛔️ عذراً، حسابك غير مصرح له بتغيير حالات الطلبات.',
          botToken: process.env.TELEGRAM_ORDERS_BOT_TOKEN || 'your_orders_bot_token_here',
          parseMode: 'Markdown',
        });
        return Response.json({ ok: true });
      }

      if (data.startsWith('status:')) {
        const [, orderId, newStatus] = data.split(':');
        const orderRepo = getOrderRepository();

        const updatedOrder = await orderRepo.updateOrderStatus(orderId, newStatus as OrderStatus);
        if (updatedOrder && message) {
          await telegramOrderService.sendOrderStatusUpdate(
            updatedOrder,
            newStatus as OrderStatus,
            message.message_id,
            String(message.chat.id)
          );
        }
      }

      return Response.json({ ok: true });
    }

    return Response.json({ ok: true });
  } catch (error: unknown) {
    console.error('[Orders Webhook API] Error:', sanitizeLog(error));
    return Response.json({ ok: false, error: 'Internal Webhook Error' }, { status: 500 });
  }
}
