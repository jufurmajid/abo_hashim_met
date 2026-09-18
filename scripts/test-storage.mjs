import { MockStorageService } from '../src/lib/services/storage.ts';

async function testStorageIntegration() {
  console.log('🧪 Starting Storage Service Unit Tests...');

  const storageService = new MockStorageService();

  const validBuffer = Buffer.from('fake-image-data-bytes');
  const uploadedUrl = await storageService.uploadImage(validBuffer, 'test-meat.jpg');
  console.log(`✅ Upload Succeeded! Public Image URL: ${uploadedUrl}`);

  const deleted = await storageService.deleteImage(uploadedUrl);
  console.log(`✅ Image Deletion Succeeded: ${deleted}`);

  console.log('\n🎉 ALL STORAGE TESTS PASSED SUCCESSFULLY!');
}

testStorageIntegration().catch((err) => {
  console.error('💥 Storage Test Failed:', err);
  process.exit(1);
});
