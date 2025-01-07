'use client'

import React from 'react'

interface VotingStatusProps {
  votingEnd: Date
}

export default function VotingStatus({ votingEnd }: VotingStatusProps) {
  const now = new Date()
  const endDate = new Date(votingEnd)
  const isExpired = endDate <= now

  // 残り時間の計算
  const getTimeRemaining = () => {
    const totalSeconds = Math.max(0, Math.floor((endDate.getTime() - now.getTime()) / 1000))
    const days = Math.floor(totalSeconds / (24 * 60 * 60))
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)

    return { days, hours, minutes }
  }

  const timeRemaining = getTimeRemaining()

  if (isExpired) {
    return (
      <div className="bg-gray-100 border border-gray-300 rounded-md p-4 mb-4">
        <p className="text-gray-700">
          投票は終了しました（{endDate.toLocaleString('ja-JP')}）
        </p>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
      <p className="text-blue-700">
        残り時間：{timeRemaining.days}日 {timeRemaining.hours}時間 {timeRemaining.minutes}分
      </p>
      <p className="text-sm text-blue-600 mt-1">
        投票期限：{endDate.toLocaleString('ja-JP')}
      </p>
    </div>
  )
}