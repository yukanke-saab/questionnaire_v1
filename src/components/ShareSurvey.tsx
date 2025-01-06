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
    const text = `📊 アンケートに答えてください！\n\n${title}\n\n`
    // Twitterの共有URLを生成して直接遷移
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank')
    setIsShared(true)
  }

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      <button
        onClick={handleShare}
        className="bg-[#1DA1F2] text-white px-6 py-2 rounded-full shadow-lg hover:bg-[#1a8cd8] transition-colors flex items-center space-x-2"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 16 16"
          className="w-5 h-5 fill-current"
        >
          <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
        </svg>
        <span>Twitterで共有</span>
      </button>
    </div>
  )
}
