import { put, del } from '@vercel/blob'
import { StorageService } from './types'

export class VercelStorage implements StorageService {
  async uploadFile(file: Buffer, filename: string, mimeType: string): Promise<string> {
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: mimeType
    })
    return blob.url
  }

  async deleteFile(url: string): Promise<void> {
    await del(url)
  }
}