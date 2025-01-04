import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getServerSession } from "next-auth/next"
import SessionProvider from '@/components/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Questionnaire App',
  description: 'Create and share questionnaires easily',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="ja">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}