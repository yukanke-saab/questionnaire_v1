import Link from 'next/link'
import { getServerSession } from 'next-auth/next'

export default async function Home() {
  const session = await getServerSession()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">アンケートアプリ</h1>
      
      {session ? (
        <div className="space-y-4">
          <Link
            href="/create"
            className="block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors text-center"
          >
            アンケートを作成する
          </Link>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4 text-gray-600">アンケートの作成・回答にはログインが必要です</p>
          <Link
            href="/api/auth/signin"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            ログイン
          </Link>
        </div>
      )}
    </main>
  )
}