'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full bg-white border-b">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          {/* ロゴ */}
          <Link href="/" className="text-xl text-blue-600 font-bold">
            アンケートアプリ
          </Link>

          {/* モバイルメニューボタン */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="block md:hidden">
            {isMenuOpen ? <X /> : <Menu />}
          </button>

          {/* PC用メニュー */}
          <div className="hidden md:flex gap-4">
            {session ? (
              <>
                <Link href="/create" className="text-gray-600">新規作成</Link>
                <Link href="/my/surveys" className="text-gray-600">作成したアンケート</Link>
                <Link href="/my/responses" className="text-gray-600">回答したアンケート</Link>
                <button onClick={() => signOut()} className="text-gray-600">ログアウト</button>
              </>
            ) : (
              <button onClick={() => signIn('twitter')} className="text-gray-600">ログイン</button>
            )}
          </div>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            {session ? (
              <div className="flex flex-col gap-2">
                <Link href="/create" className="text-gray-600">新規作成</Link>
                <Link href="/my/surveys" className="text-gray-600">作成したアンケート</Link>
                <Link href="/my/responses" className="text-gray-600">回答したアンケート</Link>
                <button onClick={() => signOut()} className="text-gray-600 text-left">ログアウト</button>
              </div>
            ) : (
              <button onClick={() => signIn('twitter')} className="text-gray-600">ログイン</button>
            )}
          </div>
        )}
      </div>
    </header>
  )
}