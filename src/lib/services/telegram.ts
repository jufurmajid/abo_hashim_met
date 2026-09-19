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
 * Sanitizes text or error objects to ensure bot tokens and sensitive credentials
 * are never printed in console logs, error messages, or build logs.
 */
export function sanitizeLog(input: unknown, tokenToMask?: string): string {
  let str = '';
  if (input instanceof Error) {
    str = `${input.name}: ${input.message}`;
  } else if (typeof input === 'object' && input !== null) {
    try {
      str = JSON.stringify(input);
    } catch {
      str = String(input);
    }
  } else {
    str = String(input);
  }

  // Mask Telegram Bot Token regex pattern (e.g. bot123456789:ABCdefGHI...)
  str = str.replace(/bot\d+:[A-Za-z0-9_-]+/gi, 'bot[REDACTED_TOKEN]');

  // Mask explicit token if provided
  if (tokenToMask && tokenToMask.length > 5) {
    str = str.split(tokenToMask).join('[REDACTED_TOKEN]');
  }

  return str;
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
      console.error(
        `[Telegram Helper] Attempt ${attempt} failed (${response.status}):`,
        sanitizeLog(errData, options.botToken)
      );

      // If Telegram failed due to parse_mode formatting (HTTP 400), retry without parse_mode
      if (response.status === 400 && options.parseMode) {
        try {
          const fallbackBody = { ...body };
          delete fallbackBody.parse_mode;
          const fallbackRes = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fallbackBody),
          });
          if (fallbackRes.ok) {
            return true;
          }
        } catch (fallbackErr) {
          console.error('[Telegram Helper] Fallback plain-text send error:', sanitizeLog(fallbackErr, options.botToken));
        }
      }
    } catch (err) {
      console.error(
        `[Telegram Helper] Attempt ${attempt} network error:`,
        sanitizeLog(err, options.botToken)
      );
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
    if (response.ok) return true;

    if (response.status === 400 && options.parseMode) {
      const fallbackBody = { ...body };
      delete fallbackBody.parse_mode;
      const fallbackRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fallbackBody),
      });
      return fallbackRes.ok;
    }

    return false;
  } catch (err) {
    console.error('[Telegram Helper] Edit message error:', sanitizeLog(err, options.botToken));
    return false;
  }
}
