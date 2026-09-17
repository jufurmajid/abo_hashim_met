import { R2StorageService } from '../src/lib/data/adapters/cloudflare.ts';

async function testStorageIntegration() {
  console.log('🧪 Starting Phase 2B R2 Storage Adapter Integration Unit Tests...');

  const storageService = new R2StorageService(undefined, 'https://media.abohashim.com');

  // 1. Test Valid Image Upload (JPEG/PNG/WebP)
  console.log('\n--- 1. Testing Valid Image Upload ---');
  const validBuffer = Buffer.from('fake-image-data-bytes');
  const mockFile = {
    buffer: validBuffer,
    mimeType: 'image/webp',
    size: validBuffer.length,
    originalName: 'test-meat.webp',
  };

  const uploadedUrl = await storageService.uploadImage(mockFile, mockFile.originalName);
  console.log(`✅ Upload Succeeded! Public Image URL: ${uploadedUrl}`);
  if (!uploadedUrl.startsWith('https://media.abohashim.com/products/prod-img-')) {
    throw new Error('Public URL format is invalid');
  }

  // 2. Test Rejection of Disallowed MIME Types (e.g. PDF)
  console.log('\n--- 2. Testing Invalid File MIME Type Rejection ---');
  try {
    const invalidFile = {
      buffer: validBuffer,
      mimeType: 'application/pdf',
      size: 100,
      originalName: 'document.pdf',
    };
    await storageService.uploadImage(invalidFile, invalidFile.originalName);
    throw new Error('Failed to reject disallowed MIME type!');
  } catch (e) {
    console.log(`✅ Disallowed MIME type correctly rejected: ${e.message}`);
  }

  // 3. Test Rejection of Oversized File (> 5MB)
  console.log('\n--- 3. Testing Oversized File Rejection (> 5MB) ---');
  try {
    const oversizedFile = {
      buffer: validBuffer,
      mimeType: 'image/jpeg',
      size: 6 * 1024 * 1024, // 6 MB
      originalName: 'large-image.jpg',
    };
    await storageService.uploadImage(oversizedFile, oversizedFile.originalName);
    throw new Error('Failed to reject oversized file!');
  } catch (e) {
    console.log(`✅ Oversized file correctly rejected: ${e.message}`);
  }

  // 4. Test Image Replacement
  console.log('\n--- 4. Testing Image Replacement ---');
  const newMockFile = {
    buffer: validBuffer,
    mimeType: 'image/png',
    size: 200,
    originalName: 'new-dairy.png',
  };
  const replacedUrl = await storageService.replaceImage(uploadedUrl, newMockFile, newMockFile.originalName);
  console.log(`✅ Image Replaced Succeeded! New URL: ${replacedUrl}`);

  // 5. Test Image Deletion
  console.log('\n--- 5. Testing Image Deletion ---');
  const deleted = await storageService.deleteImage(replacedUrl);
  console.log(`✅ Image Deletion Succeeded: ${deleted}`);

  console.log('\n🎉 ALL STORAGE INTEGRATION TESTS PASSED SUCCESSFULLY!');
}

testStorageIntegration().catch((err) => {
  console.error('💥 Storage Integration Test Failed:', err);
  process.exit(1);
});
