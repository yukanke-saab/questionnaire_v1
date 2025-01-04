import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">アンケートアプリ</h1>
      <Link
        href="/create"
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        アンケートを作成する
      </Link>
    </main>
  )
}