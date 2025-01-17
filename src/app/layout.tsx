import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getServerSession } from "next-auth"
import SessionProvider from '../components/SessionProvider'
import Header from '@/components/Header'
import { authOptions } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'アンケton - 手軽に作れるアンケートサービス',
  description: '画像付きの選択肢、属性別の分析など、手軽に本格的なアンケートが作れるサービスです。',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-50`}>
        <SessionProvider session={session}>
          <Header />
          <div className="min-h-[calc(100vh-4rem)]">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}