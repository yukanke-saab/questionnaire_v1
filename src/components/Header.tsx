'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

export default function Header() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Left - Logo */}
          <div className="flex">
            <Link 
              href="/" 
              className="flex items-center font-bold text-xl text-pink-500 hover:text-pink-600"
            >
              アンケton
            </Link>
          </div>

          {/* Right - Navigation Links (Desktop) */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/create"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-pink-500 hover:bg-gray-50"
                >
                  新規作成
                </Link>
                <Link
                  href="/my"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-pink-500 hover:bg-gray-50"
                >
                  作成したアンケート
                </Link>
                <Link
                  href="/my?filter=responded"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-pink-500 hover:bg-gray-50"
                >
                  回答したアンケート
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2">
                    {session.user?.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'プロフィール画像'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                  </button>
                  <div className="hidden group-hover:block absolute right-0 mt-2 py-1 w-48 bg-white rounded-md shadow-lg">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {session.user?.name}
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      ログアウト
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => signIn('twitter')}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-pink-500 hover:bg-gray-50"
              >
                ログイン
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-pink-500 hover:bg-gray-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">メニューを開く</span>
              {!isMenuOpen ? (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <X className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2 border-t border-gray-200">
            {session ? (
              <div className="space-y-1">
                <div className="px-4 py-2 border-b flex items-center space-x-3">
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'プロフィール画像'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-700">{session.user?.name}</span>
                </div>
                <Link
                  href="/create"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-pink-500 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  新規作成
                </Link>
                <Link
                  href="/my"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-pink-500 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  作成したアンケート
                </Link>
                <Link
                  href="/my?filter=responded"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-pink-500 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  回答したアンケート
                </Link>
                <button
                  onClick={() => {
                    signOut()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-pink-500 hover:bg-gray-50"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  signIn('twitter')
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-pink-500 hover:bg-gray-50"
              >
                ログイン
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  )
}