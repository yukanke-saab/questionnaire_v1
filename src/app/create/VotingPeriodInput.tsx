'use client'

import React from 'react'

interface VotingPeriodInputProps {
  days: number
  hours: number
  minutes: number
  onDaysChange: (value: number) => void
  onHoursChange: (value: number) => void
  onMinutesChange: (value: number) => void
}

export default function VotingPeriodInput({
  days,
  hours,
  minutes,
  onDaysChange,
  onHoursChange,
  onMinutesChange,
}: VotingPeriodInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        投票期間
      </label>
      <div className="flex gap-4 items-end">
        <div>
          <input
            type="number"
            min="0"
            value={days}
            onChange={(e) => onDaysChange(parseInt(e.target.value) || 0)}
            className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">日</span>
        </div>
        <div>
          <input
            type="number"
            min="0"
            max="23"
            value={hours}
            onChange={(e) => onHoursChange(parseInt(e.target.value) || 0)}
            className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">時間</span>
        </div>
        <div>
          <input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => onMinutesChange(parseInt(e.target.value) || 0)}
            className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">分</span>
        </div>
      </div>
    </div>
  )
}