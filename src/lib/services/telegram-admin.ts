import { Product, CategoryId } from '@/types';
import { IProductRepository, IOrderRepository } from '@/lib/data/interfaces';
import { sendTelegramMessage } from './telegram';
import { syncFileToGitHub } from '../github';

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
  private customBotToken?: string;
  private customDefaultChatId?: string;

  constructor(botToken?: string, defaultChatId?: string) {
    this.customBotToken = botToken;
    this.customDefaultChatId = defaultChatId;
  }

  private get botToken(): string {
    return this.customBotToken || process.env.TELEGRAM_ADMIN_BOT_TOKEN || 'your_admin_bot_token_here';
  }

  private get defaultChatId(): string {
    return this.customDefaultChatId || process.env.TELEGRAM_ADMIN_CHAT_ID || 'your_admin_chat_id_here';
  }

  async handleAdminCommand(
    chatId: string,
    commandText: string,
    productRepo: IProductRepository,
    orderRepo: IOrderRepository
  ): Promise<string> {
    // Strip invisible Unicode control/formatting characters (RTL/LTR marks, zero-width spaces, BOM, etc.)
    const cleanedText = (commandText || '')
      .replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E\u00A0]/g, '')
      .trim();

    if (!cleanedText) return '❌ يرجى كتابة أمر صحيح. استخدم `/help` لعرض الأوامر المتاحة.';

    const parts = cleanedText.split(/\s+/);
    let rawCmd = parts[0].toLowerCase().trim();

    // Clean leading/trailing quotes or brackets if present
    rawCmd = rawCmd.replace(/^['"]+|['"]+$/g, '');

    // Strip @botusername suffix if present (e.g., /start@AboHashimAdminBot -> /start)
    rawCmd = rawCmd.split('@')[0];

    // Ensure leading slash for uniform route matching
    const command = rawCmd.startsWith('/') ? rawCmd : '/' + rawCmd;
    const args = parts.slice(1);

    // Safe diagnostic metadata logging (No tokens, secrets, or PII)
    console.log('[Admin Router Debug]', {
      commandLength: command.length,
      firstCodePoint: command.length > 0 ? command.codePointAt(0) : null,
      isStartMatch:
        command === '/start' ||
        command.startsWith('/start') ||
        command === '/help' ||
        command.startsWith('/help') ||
        command === '/مساعدة' ||
        command === '/أوامر' ||
        command === '/الرئيسية' ||
        command === '/بداية',
    });

    if (
      command === '/start' ||
      command.startsWith('/start') ||
      command === '/help' ||
      command.startsWith('/help') ||
      command === '/مساعدة' ||
      command === '/أوامر' ||
      command === '/الرئيسية' ||
      command === '/بداية'
    ) {
      return (
        `👑 *لوحة تحكم إدارة متجر أبو هاشم (GitHub Sync)*\n\n` +
        `الأوامر المتاحة لإدارة المنتجات:\n` +
        `• \`/products\` : عرض كافة المنتجات والأسعار والمخزون\n` +
        `• \`/addproduct [الاسم] [السعر] [المخزون] [التصنيف] [الوحدة] [الوصف] [رابط_الصورة]\` : إضافة منتج جديد (استخدم _ بدل الفراغات)\n` +
        `• \`/editproduct [ID_المنتج] [الحقل] [القيمة_الجديدة]\` : تعديل حقل محدد (name/price/stock/category/unit/description/image)\n` +
        `• \`/deleteproduct [ID_المنتج]\` : حذف منتج نهائياً\n` +
        `• \`/updateprice [ID_المنتج] [السعر_الجديد]\` : تعديل سعر منتج\n` +
        `• \`/updatestock [ID_المنتج] [المخزون_الجديد]\` : تعديل كمية المخزون\n` +
        `• \`/toggleproduct [ID_المنتج]\` : إخفاء/إظهار منتج\n` +
        `• \`/syncgithub\` : مزامنة وتحديث بيانات المنتجات في GitHub يدوياً\n` +
        `• \`/orders\` : عرض أحدث طلبات الزبائن\n\n` +
        `💡 *التصنيفات المتاحة:* \`meats\` (لحوم), \`dairy\` (ألبان), \`cheese\` (أجبان), \`other\` (أخرى)`
      );
    }

    if (
      command === '/products' ||
      command.startsWith('/products') ||
      command === '/المنتجات' ||
      command === '/عرض_المنتجات' ||
      command === '/قائمة_المنتجات'
    ) {
      const products = await productRepo.getAllProducts();
      if (products.length === 0) return '📦 لا توجد منتجات مسجلة حالياً.';

      const list = products
        .map(
          (p) =>
            `• *${p.name}* (\`${p.id}\`)\n` +
            `  السعر: ${p.price.toLocaleString('ar-IQ')} د.ع / ${p.unit}\n` +
            `  المخزون: ${p.stock} | التصنيف: ${p.category} | الحالة: ${p.isAvailable ? '🟢 متوفر' : '🔴 غير متوفر'}`
        )
        .join('\n\n');

      return `📦 *قائمة جميع المنتجات (${products.length}):*\n\n${list}`;
    }

    if (
      command === '/orders' ||
      command.startsWith('/orders') ||
      command === '/الطلبات' ||
      command === '/عرض_الطلبات'
    ) {
      const orders = await orderRepo.getAllOrders();
      if (orders.length === 0) return '📑 لا توجد طلبات مسجلة حتى الآن.';

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

    if (
      command === '/addproduct' ||
      command.startsWith('/addproduct') ||
      command === '/إضافة_منتج' ||
      command === '/اضافة_منتج'
    ) {
      if (args.length < 3) {
        return (
          '❌ يرجى استخدام الصيغة:\n' +
          '`/addproduct [الاسم] [السعر] [المخزون] [التصنيف] [الوحدة] [الوصف] [رابط_الصورة]`\n\n' +
          'مثال:\n`/addproduct لحم_غنم_بلدي 18000 25 meats كغم طازج_ومقطع https://example.com/img.jpg`'
        );
      }

      const [rawName, priceStr, stockStr, categoryArg, rawUnit, rawDesc, rawImg] = args;
      const name = rawName.replace(/_/g, ' ');
      const price = parseFloat(priceStr);
      const stock = parseInt(stockStr, 10);
      const category = categoryArg || 'meats';
      const unit = rawUnit ? rawUnit.replace(/_/g, ' ') : 'كغم';
      const description = rawDesc ? rawDesc.replace(/_/g, ' ') : 'منتج طازج وموثوق من متجر أبو هاشم';
      const imageUrl = rawImg || 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=800&auto=format&fit=crop';

      if (isNaN(price) || price < 0 || isNaN(stock) || stock < 0) {
        return '❌ السعر أو المخزون غير صحيح.';
      }

      const validCategories: CategoryId[] = ['meats', 'dairy', 'cheese', 'other'];
      const validCategory = validCategories.includes(category as CategoryId) ? (category as CategoryId) : 'other';

      const newProd = await productRepo.createProduct({
        name,
        description,
        price,
        category: validCategory,
        unit,
        stock,
        isAvailable: stock > 0,
        imageUrl,
      });

      return (
        `🎉 *تم إضافة المنتج الجديد بنجاح والمزامنة مع GitHub!*\n\n` +
        `*الاسم:* ${newProd.name}\n` +
        `*ID:* \`${newProd.id}\`\n` +
        `*السعر:* ${newProd.price.toLocaleString('ar-IQ')} د.ع / ${newProd.unit}\n` +
        `*التصنيف:* ${newProd.category}\n` +
        `*المخزون:* ${newProd.stock}\n` +
        `*الوصف:* ${newProd.description}\n` +
        `*الصورة:* ${newProd.imageUrl}`
      );
    }

    if (
      command === '/editproduct' ||
      command.startsWith('/editproduct') ||
      command === '/تعديل_منتج'
    ) {
      if (args.length < 3) {
        return (
          '❌ يرجى استخدام الصيغة:\n' +
          '`/editproduct [ID_المنتج] [الحقل] [القيمة_الجديدة]`\n\n' +
          'الحقول المتاحة: `name`, `price`, `stock`, `category`, `unit`, `description`, `image`'
        );
      }

      const [prodId, field, ...valueParts] = args;
      const rawValue = valueParts.join(' ');
      const existing = await productRepo.getProductById(prodId);
      if (!existing) return `❌ المنتج بـ ID \`${prodId}\` غير موجود.`;

      const updates: Partial<Product> = {};

      switch (field.toLowerCase()) {
        case 'name':
          updates.name = rawValue.replace(/_/g, ' ');
          break;
        case 'price': {
          const p = parseFloat(rawValue);
          if (isNaN(p) || p < 0) return '❌ السعر غير صحيح.';
          updates.price = p;
          break;
        }
        case 'stock': {
          const s = parseInt(rawValue, 10);
          if (isNaN(s) || s < 0) return '❌ كمية المخزون غير صحيحة.';
          updates.stock = s;
          updates.isAvailable = s > 0;
          break;
        }
        case 'category': {
          const validCats: CategoryId[] = ['meats', 'dairy', 'cheese', 'other'];
          if (!validCats.includes(rawValue as CategoryId)) {
            return '❌ تصنيف غير صحيح. التصنيفات المتاحة: `meats`, `dairy`, `cheese`, `other`';
          }
          updates.category = rawValue as CategoryId;
          break;
        }
        case 'unit':
          updates.unit = rawValue.replace(/_/g, ' ');
          break;
        case 'description':
          updates.description = rawValue.replace(/_/g, ' ');
          break;
        case 'image':
        case 'imageurl':
          updates.imageUrl = rawValue;
          break;
        default:
          return '❌ الحقل غير معروف. الحقول المتاحة: `name`, `price`, `stock`, `category`, `unit`, `description`, `image`';
      }

      const updated = await productRepo.updateProduct(prodId, updates);
      return `✅ تم تعديل حقل *${field}* للمنتج *${updated?.name}* بنجاح وتحديث GitHub!`;
    }

    if (
      command === '/deleteproduct' ||
      command.startsWith('/deleteproduct') ||
      command === '/حذف_منتج'
    ) {
      if (args.length < 1) return '❌ يرجى استخدام الصيغة: `/deleteproduct [ID_المنتج]`';
      const prodId = args[0];
      const existing = await productRepo.getProductById(prodId);
      if (!existing) return `❌ المنتج بـ ID \`${prodId}\` غير موجود.`;

      const deleted = await productRepo.deleteProduct(prodId);
      if (deleted) {
        return `🗑️ تم حذف المنتج *${existing.name}* (\`${prodId}\`) بنجاح وتحديث GitHub!`;
      }
      return `❌ فشل حذف المنتج بـ ID \`${prodId}\`.`;
    }

    if (
      command === '/updateprice' ||
      command.startsWith('/updateprice') ||
      command === '/تعديل_سعر'
    ) {
      if (args.length < 2) return '❌ يرجى استخدام الصيغة: `/updateprice [ID_المنتج] [السعر_الجديد]`';
      const [prodId, priceStr] = args;
      const newPrice = parseFloat(priceStr);
      if (isNaN(newPrice) || newPrice < 0) return '❌ السعر غير صحيح.';

      const updated = await productRepo.updateProduct(prodId, { price: newPrice });
      if (!updated) return `❌ المنتج بـ ID \`${prodId}\` غير موجود.`;

      return `✅ تم تعديل سعر *${updated.name}* بنجاح إلى: *${updated.price.toLocaleString('ar-IQ')} د.ع* وتم التحديث في GitHub.`;
    }

    if (
      command === '/updatestock' ||
      command.startsWith('/updatestock') ||
      command === '/تعديل_مخزون'
    ) {
      if (args.length < 2) return '❌ يرجى استخدام الصيغة: `/updatestock [ID_المنتج] [المخزون_الجديد]`';
      const [prodId, stockStr] = args;
      const newStock = parseInt(stockStr, 10);
      if (isNaN(newStock) || newStock < 0) return '❌ كمية المخزون غير صحيحة.';

      const updated = await productRepo.updateProduct(prodId, {
        stock: newStock,
        isAvailable: newStock > 0,
      });
      if (!updated) return `❌ المنتج بـ ID \`${prodId}\` غير موجود.`;

      return `✅ تم تعديل مخزون *${updated.name}* بنجاح إلى: *${updated.stock}* وتم التحديث في GitHub.`;
    }

    if (
      command === '/toggleproduct' ||
      command.startsWith('/toggleproduct') ||
      command === '/تغيير_حالة'
    ) {
      if (args.length < 1) return '❌ يرجى استخدام الصيغة: `/toggleproduct [ID_المنتج]`';
      const prodId = args[0];
      const existing = await productRepo.getProductById(prodId);
      if (!existing) return `❌ المنتج بـ ID \`${prodId}\` غير موجود.`;

      const updated = await productRepo.updateProduct(prodId, { isAvailable: !existing.isAvailable });
      return `✅ تم تغيير حالة *${updated?.name}* إلى: ${updated?.isAvailable ? '🟢 متوفر' : '🔴 غير متوفر'} وتم التحديث في GitHub.`;
    }

    if (
      command === '/syncgithub' ||
      command.startsWith('/syncgithub') ||
      command === '/مزامنة'
    ) {
      const allProds = await productRepo.getAllProducts();
      const res = await syncFileToGitHub({
        filePath: 'src/data/products.json',
        content: JSON.stringify(allProds, null, 2),
        commitMessage: 'تحديث يدوي لبيانات المنتجات عبر بوت الإدارة',
      });
      return res.success
        ? `🔄 *تمت المزامنة بنجاح مع GitHub!*\n${res.message}`
        : `❌ *فشلت المزامنة مع GitHub:*\n${res.message}`;
    }

    return '❌ أمر غير معروف. استخدم `/help` لعرض قائمة الأوامر المتاحة.';
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
