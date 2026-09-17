/**
 * Interface for Storage operations (e.g., Cloudflare R2 bucket image uploads).
 * Will be implemented in Phase 2 using R2 SDK / Workers S3 bindings.
 */
export interface IStorageService {
  uploadImage(file: File | Buffer, filename: string): Promise<string>;
  deleteImage(fileUrl: string): Promise<boolean>;
}

export class MockStorageService implements IStorageService {
  async uploadImage(file: File | Buffer, filename: string): Promise<string> {
    console.log(`[Mock Storage Service] Uploading ${filename}`);
    return `https://r2-bucket.placeholder.com/products/${filename}`;
  }

  async deleteImage(fileUrl: string): Promise<boolean> {
    console.log(`[Mock Storage Service] Deleting image ${fileUrl}`);
    return true;
  }
}
