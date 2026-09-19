import { getProductRepository, getOrderRepository } from '@/lib/data/factory';
import { telegramAdminService } from '@/lib/services/telegram-admin';
import { sendTelegramMessage, sanitizeLog } from '@/lib/services/telegram';

export async function POST(request: Request) {
  try {
    const update = await request.json();
    const msg = update.message || update.edited_message || update.channel_post;

    if (msg && (msg.text || msg.caption)) {
      const chatId = String(msg.chat.id).trim();
      const text = String(msg.text || msg.caption).trim();

      // Verify that the incoming chat ID matches the authorized TELEGRAM_ADMIN_CHAT_ID
      const authorizedChatId = process.env.TELEGRAM_ADMIN_CHAT_ID ? process.env.TELEGRAM_ADMIN_CHAT_ID.trim() : '';

      if (authorizedChatId && authorizedChatId !== 'your_admin_chat_id_here' && chatId !== authorizedChatId) {
        console.warn(`[Admin Webhook API] Unauthorized command attempt from chatId: ${chatId}`);
        await sendTelegramMessage({
          chatId,
          text: '⛔️ عذراً، حسابك غير مصرح له بتنفيذ أية أوامر في لوحة تحكم متجر أبو هاشم.',
          botToken: process.env.TELEGRAM_ADMIN_BOT_TOKEN || 'your_admin_bot_token_here',
          parseMode: 'Markdown',
        });
        return Response.json({ ok: true });
      }

      const productRepo = getProductRepository();
      const orderRepo = getOrderRepository();

      const responseText = await telegramAdminService.handleAdminCommand(
        chatId,
        text,
        productRepo,
        orderRepo
      );

      const botToken = process.env.TELEGRAM_ADMIN_BOT_TOKEN || 'your_admin_bot_token_here';

      await sendTelegramMessage({
        chatId,
        text: responseText,
        botToken,
        parseMode: 'Markdown',
      });
    }

    return Response.json({ ok: true });
  } catch (error: unknown) {
    console.error('[Admin Webhook API] Error:', sanitizeLog(error));
    return Response.json({ ok: false, error: 'Internal Webhook Error' }, { status: 500 });
  }
}
