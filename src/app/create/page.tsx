'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import CreateSurveyForm from '@/components/CreateSurveyForm'
import LoginPrompt from '@/components/LoginPrompt'

export default function CreatePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!session) {
    return <LoginPrompt />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">新しいアンケートを作成</h1>
      <CreateSurveyForm />
    </div>
  )
}