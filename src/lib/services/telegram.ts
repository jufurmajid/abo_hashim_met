export interface TelegramInlineButton {
  text: string;
  callback_data: string;
}

export interface TelegramSendMessageOptions {
  chatId: string;
  text: string;
  botToken: string;
  parseMode?: 'Markdown' | 'HTML';
  inlineKeyboard?: TelegramInlineButton[][];
}

export interface TelegramEditMessageOptions {
  chatId: string;
  messageId: number;
  text: string;
  botToken: string;
  parseMode?: 'Markdown' | 'HTML';
  inlineKeyboard?: TelegramInlineButton[][];
}

/**
 * Sends a message via Telegram Bot API with retry mechanism and timeout.
 */
export async function sendTelegramMessage(options: TelegramSendMessageOptions): Promise<boolean> {
  if (!options.botToken || options.botToken === 'your_orders_bot_token_here' || options.botToken === 'your_admin_bot_token_here') {
    console.log('[Telegram Helper] Bot token not set. Mocking message output:\n', options.text);
    return true;
  }

  const url = `https://api.telegram.org/bot${options.botToken}/sendMessage`;
  const body: Record<string, unknown> = {
    chat_id: options.chatId,
    text: options.text,
    parse_mode: options.parseMode || 'Markdown',
  };

  if (options.inlineKeyboard) {
    body.reply_markup = {
      inline_keyboard: options.inlineKeyboard,
    };
  }

  const maxRetries = 2;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return true;
      }

      const errData = await response.text();
      console.error(`[Telegram Helper] Attempt ${attempt} failed (${response.status}):`, errData);
    } catch (err) {
      console.error(`[Telegram Helper] Attempt ${attempt} network error:`, err);
    }
  }

  return false;
}

/**
 * Edits an existing message text or inline keyboard via Telegram Bot API.
 */
export async function editTelegramMessage(options: TelegramEditMessageOptions): Promise<boolean> {
  if (!options.botToken || options.botToken === 'your_orders_bot_token_here' || options.botToken === 'your_admin_bot_token_here') {
    console.log('[Telegram Helper] Bot token not set. Mocking edit message:\n', options.text);
    return true;
  }

  const url = `https://api.telegram.org/bot${options.botToken}/editMessageText`;
  const body: Record<string, unknown> = {
    chat_id: options.chatId,
    message_id: options.messageId,
    text: options.text,
    parse_mode: options.parseMode || 'Markdown',
  };

  if (options.inlineKeyboard) {
    body.reply_markup = {
      inline_keyboard: options.inlineKeyboard,
    };
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.ok;
  } catch (err) {
    console.error('[Telegram Helper] Edit message error:', err);
    return false;
  }
}
