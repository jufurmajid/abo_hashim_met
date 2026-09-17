import { Product } from '@/types';

/**
 * Service interface for Telegram Admin Bot operations.
 * Will be implemented in Phase 2 using Telegram Bot API and Cloudflare Workers.
 */
export interface ITelegramAdminService {
  handleAdminCommand(chatId: string, command: string, args?: string[]): Promise<string>;
  notifyProductStockLow(product: Product): Promise<void>;
  updateProductViaBot(productId: string, updates: Partial<Product>): Promise<Product | null>;
  toggleProductAvailability(productId: string): Promise<boolean>;
}

export class MockTelegramAdminService implements ITelegramAdminService {
  async handleAdminCommand(chatId: string, command: string): Promise<string> {
    return `[Mock Admin Bot] Command received: ${command} from chatId: ${chatId}`;
  }

  async notifyProductStockLow(product: Product): Promise<void> {
    console.log(`[Mock Admin Bot] Alert: Stock for ${product.name} is low (${product.stock})`);
  }

  async updateProductViaBot(productId: string, updates: Partial<Product>): Promise<Product | null> {
    console.log(`[Mock Admin Bot] Updating product ${productId} with:`, updates);
    return null;
  }

  async toggleProductAvailability(productId: string): Promise<boolean> {
    console.log(`[Mock Admin Bot] Toggling availability for product ${productId}`);
    return true;
  }
}
