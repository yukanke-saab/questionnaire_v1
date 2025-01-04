'use client'

import { signIn } from 'next-auth/react'

export default function LoginPrompt() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            アンケートに回答するには
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Twitterでログインしてください
          </p>
        </div>
        <div>
          <button
            onClick={() => signIn('twitter')}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Twitterでログイン
          </button>
        </div>
      </div>
    </div>
  )
}