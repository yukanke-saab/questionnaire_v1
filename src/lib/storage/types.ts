export interface StorageService {
  uploadFile(file: Buffer, filename: string, mimeType: string): Promise<string>;
  deleteFile(url: string): Promise<void>;
}