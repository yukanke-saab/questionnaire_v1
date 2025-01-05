'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

export default function SignIn() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            アカウントにログイン
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            アンケートの作成・回答には
            <br />
            Twitterアカウントでのログインが必要です
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <button
              onClick={() => signIn('twitter', { callbackUrl })}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Twitterでログイン
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}