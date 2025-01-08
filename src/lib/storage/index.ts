import { StorageService } from './types'
import { MinioStorage } from './minio-storage'
import { VercelStorage } from './vercel-storage'

export function createStorageService(): StorageService {
  const storageType = process.env.STORAGE_TYPE || 'minio'

  switch (storageType) {
    case 'vercel':
      return new VercelStorage()
    case 'minio':
      return new MinioStorage()
    default:
      throw new Error(`Unknown storage type: ${storageType}`)
  }
}

export const storage = createStorageService()