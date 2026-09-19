import { telegramOrderService } from '../src/lib/services/telegram-order.ts';
import { telegramAdminService } from '../src/lib/services/telegram-admin.ts';
import { getProductRepository, getOrderRepository } from '../src/lib/data/factory.ts';

async function testTelegramBots() {
  console.log('🧪 Starting Telegram Bots Integration Unit Tests...');

  const productRepo = getProductRepository();
  const orderRepo = getOrderRepository();

  // 1. Create a sample order to test Orders Bot notification message formatting
  console.log('\n--- 1. Testing Orders Bot Message Formatting ---');
  const sampleOrder = await orderRepo.createOrder({
    customer: {
      fullName: 'جعفر ماجد (زبون تجريبي)',
      phone: '07701234567',
      governorate: 'بغداد',
      area: 'المنصور',
      address: 'شارع الرواد، زقاق 12، دار 5',
      landmark: 'قرب مول المنصور',
      notes: 'تغليف خاص للحوم',
    },
    items: [
      { productId: 'prod-1', quantity: 2 },
      { productId: 'prod-4', quantity: 1 },
    ],
  });

  const formattedMsg = telegramOrderService.formatOrderMessage(sampleOrder);
  console.log('✅ Formatted Order Message Preview:\n', formattedMsg);

  if (!formattedMsg.includes('جعفر ماجد') || !formattedMsg.includes('07701234567')) {
    throw new Error('Formatted message missing customer details');
  }

  // 2. Test Orders Bot Notification Dispatch (Mock Mode)
  console.log('\n--- 2. Testing Orders Bot Dispatch ---');
  const sentNotification = await telegramOrderService.sendNewOrderNotification(sampleOrder);
  console.log(`✅ New Order Notification Sent: ${sentNotification}`);

  // 3. Test Admin Bot Commands
  console.log('\n--- 3. Testing Admin Bot Commands ---');

  // Test /start command
  const startResponse = await telegramAdminService.handleAdminCommand('12345', '/start', productRepo, orderRepo);
  console.log('✅ /start command response:\n', startResponse);
  if (!startResponse.includes('لوحة تحكم إدارة متجر أبو هاشم')) {
    throw new Error('/start command response failed');
  }

  // Test /start@AboHashimAdminBot command
  const startTaggedResponse = await telegramAdminService.handleAdminCommand('12345', '/start@AboHashimAdminBot', productRepo, orderRepo);
  if (!startTaggedResponse.includes('لوحة تحكم إدارة متجر أبو هاشم')) {
    throw new Error('/start@AboHashimAdminBot command response failed');
  }
  console.log('✅ /start@AboHashimAdminBot response verified!');

  // Test plain-text "start" without slash
  const startPlainResponse = await telegramAdminService.handleAdminCommand('12345', 'start', productRepo, orderRepo);
  if (!startPlainResponse.includes('لوحة تحكم إدارة متجر أبو هاشم')) {
    throw new Error('Plain text start command response failed');
  }
  console.log('✅ Plain text "start" command response verified!');

  // Test /help command
  const helpResponse = await telegramAdminService.handleAdminCommand('12345', '/help', productRepo, orderRepo);
  console.log('✅ /help command response:\n', helpResponse);

  // Test /products command
  const productsResponse = await telegramAdminService.handleAdminCommand('12345', '/products', productRepo, orderRepo);
  console.log('✅ /products command response preview:\n', productsResponse.slice(0, 150) + '...');

  // Test /updateprice command
  const updatePriceResponse = await telegramAdminService.handleAdminCommand('12345', '/updateprice prod-1 20000', productRepo, orderRepo);
  console.log('✅ /updateprice response:', updatePriceResponse);

  const updatedProd = await productRepo.getProductById('prod-1');
  if (updatedProd?.price !== 20000) {
    throw new Error('Price was not updated in database by Admin Bot');
  }

  // Test /updatestock command
  const updateStockResponse = await telegramAdminService.handleAdminCommand('12345', '/updatestock prod-1 50', productRepo, orderRepo);
  console.log('✅ /updatestock response:', updateStockResponse);

  const updatedStockProd = await productRepo.getProductById('prod-1');
  if (updatedStockProd?.stock !== 50) {
    throw new Error('Stock was not updated in database by Admin Bot');
  }

  // Test /addproduct with bot username tag e.g. /addproduct@AboHashimAdminBot
  console.log('\n--- 4. Testing Username-Tagged Command & Product Creation ---');
  const addProdResponse = await telegramAdminService.handleAdminCommand(
    '12345',
    '/addproduct@AboHashimAdminBot لحم_عجل_بلدي 22000 15 meats كغم قطع_طازجة_ممتازة',
    productRepo,
    orderRepo
  );
  console.log('✅ /addproduct@AboHashimAdminBot response:\n', addProdResponse);

  if (!addProdResponse.includes('تم إضافة المنتج الجديد بنجاح')) {
    throw new Error('Failed to add product with tagged bot command');
  }

  console.log('\n🎉 ALL TELEGRAM BOTS INTEGRATION UNIT TESTS PASSED SUCCESSFULLY!');
}

testTelegramBots().catch((err) => {
  console.error('💥 Telegram Bots Integration Test Failed:', err);
  process.exit(1);
});
