import { IStorageService } from '../data/interfaces';

export class MockStorageService implements IStorageService {
  async uploadImage(_file: File | Buffer, filename: string): Promise<string> {
    return `https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=800&auto=format&fit=crop#${filename}`;
  }

  async deleteImage(_fileUrl: string): Promise<boolean> {
    return true;
  }
}
