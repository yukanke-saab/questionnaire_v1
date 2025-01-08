import { put, del } from '@vercel/blob'
import { StorageService } from './types'

export class VercelStorage implements StorageService {
  async uploadFile(file: Buffer, filename: string, mimeType: string): Promise<string> {
    // BufferをBlobに変換
    const blob = new Blob([file], { type: mimeType })

    const uploadedBlob = await put(filename, blob, {
      access: 'public',
      addRandomSuffix: true,
      contentType: mimeType
    })
    return uploadedBlob.url
  }

  async deleteFile(url: string): Promise<void> {
    await del(url)
  }
}