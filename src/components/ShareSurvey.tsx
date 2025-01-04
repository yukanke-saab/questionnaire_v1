'use client'

import { useState } from 'react'

interface ShareSurveyProps {
  surveyId: string
  title: string
}

export default function ShareSurvey({ surveyId, title }: ShareSurveyProps) {
  const [isShared, setIsShared] = useState(false)

  const handleShare = async () => {
    const url = `${window.location.origin}/survey/${surveyId}`
    const text = `📊 アンケートに答えてください！

${title}

`

    try {
      if ('share' in navigator) {
        await navigator.share({
          title: 'アンケート共有',
          text,
          url,
        })
        setIsShared(true)
      } else {
        // Web Share APIがサポートされていない場合はTwitterの共有URLを直接開く
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        window.open(twitterUrl, '_blank')
        setIsShared(true)
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      <button
        onClick={handleShare}
        className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        {isShared ? '共有済み' : 'Twitterで共有'}
      </button>
    </div>
  )
}