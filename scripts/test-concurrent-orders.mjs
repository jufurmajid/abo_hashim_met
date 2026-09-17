import { getOrderRepository, getProductRepository } from '../src/lib/data/factory.js';

async function testConcurrentOrders() {
  console.log('🧪 Starting concurrent order execution race condition test...');

  const productRepo = getProductRepository();
  const orderRepo = getOrderRepository();

  // Create a test product with stock = 1
  const testProduct = await productRepo.createProduct({
    name: 'منتج تجريبي زبدة طازجة',
    description: 'منتج لاختبار الطلبات المتزامنة',
    price: 5000,
    unit: 'قطعة',
    category: 'dairy',
    imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d',
    stock: 1,
    isAvailable: true,
  });

  console.log(`📦 Created test product ${testProduct.id} with stock = 1`);

  const orderDTO1 = {
    customer: {
      fullName: 'الزبون الأول (علي)',
      phone: '07701111111',
      governorate: 'بغداد',
      area: 'الكرادة',
      address: 'شارع 62',
      landmark: 'قرب ساحة واثق',
    },
    items: [{ productId: testProduct.id, quantity: 1 }],
  };

  const orderDTO2 = {
    customer: {
      fullName: 'الزبون الثاني (محمد)',
      phone: '07702222222',
      governorate: 'بغداد',
      area: 'المنصور',
      address: 'شارع الرواد',
      landmark: 'قرب المول',
    },
    items: [{ productId: testProduct.id, quantity: 1 }],
  };

  // Fire both order requests simultaneously using Promise.allSettled
  console.log('⚡ Firing two simultaneous order requests for the same single stock item...');
  const results = await Promise.allSettled([
    orderRepo.createOrder(orderDTO1),
    orderRepo.createOrder(orderDTO2),
  ]);

  let successCount = 0;
  let failureCount = 0;

  results.forEach((res, idx) => {
    if (res.status === 'fulfilled') {
      successCount++;
      console.log(`✅ Request ${idx + 1} Succeeded! Order ID: ${res.value.id}`);
    } else {
      failureCount++;
      console.log(`❌ Request ${idx + 1} Rejected as expected! Error: ${res.reason.message}`);
    }
  });

  const finalProduct = await productRepo.getProductById(testProduct.id);
  console.log(`📊 Final Product Stock: ${finalProduct?.stock}, isAvailable: ${finalProduct?.isAvailable}`);

  if (successCount === 1 && failureCount === 1 && finalProduct?.stock === 0) {
    console.log('🎉 TEST PASSED! Conditional Atomic Update prevents Race Condition overbooking perfectly.');
  } else {
    console.error('💥 TEST FAILED! Overbooking occurred or invalid state.');
    process.exit(1);
  }
}

testConcurrentOrders().catch((err) => {
  console.error('Fatal Test Error:', err);
  process.exit(1);
});
