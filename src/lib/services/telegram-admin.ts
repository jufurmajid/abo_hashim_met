import { Product } from '@/types';
import { IProductRepository, IOrderRepository } from '@/lib/data/interfaces';
import { sendTelegramMessage } from './telegram';

export interface ITelegramAdminService {
  handleAdminCommand(
    chatId: string,
    commandText: string,
    productRepo: IProductRepository,
    orderRepo: IOrderRepository
  ): Promise<string>;
  notifyProductStockLow(product: Product, chatId?: string): Promise<void>;
}

export class TelegramAdminService implements ITelegramAdminService {
  private botToken: string;
  private defaultChatId: string;

  constructor(botToken?: string, defaultChatId?: string) {
    this.botToken = botToken || process.env.TELEGRAM_ADMIN_BOT_TOKEN || 'your_admin_bot_token_here';
    this.defaultChatId = defaultChatId || process.env.TELEGRAM_ADMIN_CHAT_ID || 'your_admin_chat_id_here';
  }

  async handleAdminCommand(
    chatId: string,
    commandText: string,
    productRepo: IProductRepository,
    orderRepo: IOrderRepository
  ): Promise<string> {
    const parts = commandText.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case '/start':
      case '/help':
        return (
          `👑 *لوحة تحكم إدارة متجر أبو هاشم*\n\n` +
          `الأوامر المتاحة:\n` +
          `• \`/products\` : عرض كافة المنتجات والأسعار والمخزون\n` +
          `• \`/orders\` : عرض أحدث الطلبات\n` +
          `• \`/updateprice [product_id] [price]\` : تعديل سعر منتج\n` +
          `• \`/updatestock [product_id] [stock]\` : تعديل كمية المخزون\n` +
          `• \`/toggleproduct [product_id]\` : إخفاء/إظهار منتج\n` +
          `• \`/addproduct [name] [price] [category] [unit] [stock]\` : إضافة منتج جديد`
        );

      case '/products': {
        const products = await productRepo.getAllProducts();
        if (products.length === 0) return 'لا توجد منتجات مسجلة حالياً.';

        const list = products
          .map(
            (p) =>
              `• *${p.name}* (\`${p.id}\`)\n` +
              `  السعر: ${p.price.toLocaleString('ar-IQ')} د.ع | المخزون: ${p.stock} | الحالة: ${
                p.isAvailable ? '🟢 متوفر' : '🔴 غير متوفر'
              }`
          )
          .join('\n\n');

        return `📦 *قائمة جميع المنتجات (${products.length}):*\n\n${list}`;
      }

      case '/orders': {
        const orders = await orderRepo.getAllOrders();
        if (orders.length === 0) return 'لا توجد طلبات مسجلة حتى الآن.';

        const recentOrders = orders.slice(0, 5);
        const list = recentOrders
          .map(
            (o) =>
              `• *طلب #${o.id}* - ${o.customerName}\n` +
              `  المجموع: ${o.total.toLocaleString('ar-IQ')} د.ع | الحالة: ${o.status}`
          )
          .join('\n\n');

        return `📑 *أحدث الطلبات المسجلة (${recentOrders.length}/${orders.length}):*\n\n${list}`;
      }

      case '/updateprice': {
        if (args.length < 2) return '❌ يرجى استخدام الصيغة: `/updateprice [product_id] [new_price]`';
        const [prodId, priceStr] = args;
        const newPrice = parseFloat(priceStr);
        if (isNaN(newPrice) || newPrice < 0) return '❌ السعر غير صحيح.';

        const updated = await productRepo.updateProduct(prodId, { price: newPrice });
        if (!updated) return `❌ المنتج بـ ID \`${prodId}\` غير موجود.`;

        return `✅ تم تعديل سعر *${updated.name}* بنجاح إلى: *${updated.price.toLocaleString('ar-IQ')} د.ع*`;
      }

      case '/updatestock': {
        if (args.length < 2) return '❌ يرجى استخدام الصيغة: `/updatestock [product_id] [new_stock]`';
        const [prodId, stockStr] = args;
        const newStock = parseInt(stockStr, 10);
        if (isNaN(newStock) || newStock < 0) return '❌ كمية المخزون غير صحيحة.';

        const updated = await productRepo.updateProduct(prodId, {
          stock: newStock,
          isAvailable: newStock > 0,
        });
        if (!updated) return `❌ المنتج بـ ID \`${prodId}\` غير موجود.`;

        return `✅ تم تعديل مخزون *${updated.name}* بنجاح إلى: *${updated.stock}* (الحالة: ${
          updated.isAvailable ? '🟢 متوفر' : '🔴 غير متوفر'
        })`;
      }

      case '/toggleproduct': {
        if (args.length < 1) return '❌ يرجى استخدام الصيغة: `/toggleproduct [product_id]`';
        const prodId = args[0];
        const existing = await productRepo.getProductById(prodId);
        if (!existing) return `❌ المنتج بـ ID \`${prodId}\` غير موجود.`;

        const updated = await productRepo.updateProduct(prodId, { isAvailable: !existing.isAvailable });
        return `✅ تم تغيير حالة *${updated?.name}* إلى: ${updated?.isAvailable ? '🟢 متوفر' : '🔴 غير متوفر'}`;
      }

      case '/addproduct': {
        if (args.length < 5) return '❌ يرجى استخدام الصيغة: `/addproduct [name] [price] [category] [unit] [stock]`';
        const [name, priceStr, category, unit, stockStr] = args;
        const price = parseFloat(priceStr);
        const stock = parseInt(stockStr, 10);

        if (isNaN(price) || isNaN(stock)) return '❌ السعر أو المخزون غير صحيح.';

        const newProd = await productRepo.createProduct({
          name: name.replace(/_/g, ' '),
          description: 'منتج مضاف عبر بوت الإدارة',
          price,
          category: category as Product['category'],
          unit,
          stock,
          isAvailable: stock > 0,
          imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=800&auto=format&fit=crop',
        });

        return `🎉 تم إضافة المنتج الجديد بنجاح!\n*الاسم:* ${newProd.name}\n*ID:* \`${newProd.id}\`\n*السعر:* ${newProd.price.toLocaleString('ar-IQ')} د.ع\n*المخزون:* ${newProd.stock}`;
      }

      default:
        return '❌ أمر غير معروف. استخدم `/help` لعرض قائمة الأوامر المتاحة.';
    }
  }

  async notifyProductStockLow(product: Product, chatId?: string): Promise<void> {
    const targetChat = chatId || this.defaultChatId;
    const text =
      `⚠️ *تنبيه انخفاض المخزون*\n\n` +
      `المنتج: *${product.name}* (\`${product.id}\`)\n` +
      `المخزون المتبقي: *${product.stock}*\n` +
      `يرجى إعادة تعبئة المخزون عبر الأمر:\n` +
      `\`/updatestock ${product.id} [new_stock]\``;

    await sendTelegramMessage({
      chatId: targetChat,
      text,
      botToken: this.botToken,
      parseMode: 'Markdown',
    });
  }
}

export const telegramAdminService = new TelegramAdminService();
