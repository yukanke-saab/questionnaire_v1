import { Client } from 'minio'
import { StorageService } from './types'

export class MinioStorage implements StorageService {
  private client: Client
  private bucket: string

  constructor() {
    this.client = new Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY!,
      secretKey: process.env.MINIO_SECRET_KEY!
    })
    this.bucket = process.env.MINIO_BUCKET_NAME!
    
    // コンストラクタでバケットの初期化を行う
    this.initBucket().catch(console.error)
  }

  private async initBucket(): Promise<void> {
    try {
      const exists = await this.client.bucketExists(this.bucket)
      if (!exists) {
        await this.client.makeBucket(this.bucket)
        
        // バケットポリシーを設定して公開アクセスを許可
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucket}/*`]
            }
          ]
        }
        await this.client.setBucketPolicy(this.bucket, JSON.stringify(policy))
      }
    } catch (error) {
      console.log('Bucket initialization:', error)
    }
  }

  async uploadFile(file: Buffer, filename: string, mimeType: string): Promise<string> {
    await this.client.putObject(this.bucket, filename, file, file.length, {
      'Content-Type': mimeType
    })

    return `${process.env.MINIO_ENDPOINT}/${this.bucket}/${filename}`
  }

  async deleteFile(url: string): Promise<void> {
    const filename = url.split('/').pop()!
    await this.client.removeObject(this.bucket, filename)
  }
}