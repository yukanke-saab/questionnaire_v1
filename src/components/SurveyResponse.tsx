'use client'

import { useSession, signIn } from 'next-auth/react'
import { useState } from 'react'
import LoginPrompt from './LoginPrompt'
import type { Survey } from '@/types/survey'

interface SurveyResponseProps {
  survey: Survey
}

export default function SurveyResponse({ survey }: SurveyResponseProps) {
  const { data: session } = useSession()
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!session) {
    return <LoginPrompt />
  }

  const handleSubmit = async () => {
    if (!selectedChoice) {
      alert('選択肢を選んでください')
      return
    }

    setIsSubmitting(true)
    try {
      const hasAllRequiredAttributes = survey.attributes.every(
        attr => selectedAttributes[attr.id]
      )

      if (!hasAllRequiredAttributes) {
        alert('すべての属性を選択してください')
        return
      }

      const response = await fetch('/api/surveys/response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          surveyId: survey.id,
          choiceId: selectedChoice,
          attributes: Object.entries(selectedAttributes).map(([attributeId, choiceId]) => ({
            attributeId,
            choiceId,
          })),
        }),
      })

      if (!response.ok) throw new Error('Failed to submit response')

      window.location.reload()
    } catch (error) {
      console.error('Error submitting response:', error)
      alert('回答の送信に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* 選択肢 */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">回答を選択してください</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {survey.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => setSelectedChoice(choice.id)}
              className={`p-4 border rounded-lg hover:bg-gray-50 ${
                selectedChoice === choice.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {survey.choice_type !== 'IMAGE_ONLY' && choice.text && (
                <p className="text-sm">{choice.text}</p>
              )}
              {(survey.choice_type === 'TEXT_WITH_IMAGE' || survey.choice_type === 'IMAGE_ONLY') &&
                choice.image_url && (
                  <div className="mt-2">
                    <img
                      src={choice.image_url}
                      alt={choice.text || '選択肢の画像'}
                      className="max-h-32 rounded"
                    />
                  </div>
                )}
            </button>
          ))}
        </div>
      </div>

      {/* 属性選択 */}
      {survey.attributes.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-lg font-medium">回答者属性</h2>
          {survey.attributes.map((attribute) => (
            <div key={attribute.id} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {attribute.title}
              </label>
              <select
                value={selectedAttributes[attribute.id] || ''}
                onChange={(e) => setSelectedAttributes(prev => ({
                  ...prev,
                  [attribute.id]: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {attribute.choices.map((choice) => (
                  <option key={choice.id} value={choice.id}>
                    {choice.text}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* 送信ボタン */}
      <div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {isSubmitting ? '送信中...' : '回答を送信'}
        </button>
      </div>
    </div>
  )
}