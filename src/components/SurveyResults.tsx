'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { Survey } from '@/types/survey'

interface SurveyResultsProps {
  survey: Survey
}

interface OverallResult {
  name: string
  count: number
  percentage: number
}

interface AttributeResult {
  name: string
  [key: string]: number | string // インデックスシグネチャ
}

type ResultType = OverallResult | AttributeResult

export default function SurveyResults({ survey }: SurveyResultsProps) {
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null)

  const overallResults: OverallResult[] = survey.choices.map(choice => {
    const count = survey.responses.filter(r => r.choiceId === choice.id).length
    const percentage = (count / Math.max(survey.responses.length, 1)) * 100

    return {
      name: choice.text || '画像のみの選択肢',
      count,
      percentage: Math.round(percentage * 10) / 10
    }
  })

  const getAttributeResults = (attributeId: string): AttributeResult[] => {
    const attribute = survey.attributes.find(a => a.id === attributeId)
    if (!attribute) return []

    const results = attribute.choices.map(attrChoice => {
      const filteredResponses = survey.responses.filter(r => 
        r.attributes.some(a => 
          a.attributeSettingId === attributeId && 
          a.attributeChoiceId === attrChoice.id
        )
      )

      return survey.choices.map(choice => {
        const count = filteredResponses.filter(r => r.choiceId === choice.id).length
        const percentage = filteredResponses.length > 0 
          ? (count / filteredResponses.length) * 100 
          : 0

        const result: AttributeResult = {
          name: choice.text || '画像のみの選択肢'
        }
        result[attrChoice.text] = Math.round(percentage * 10) / 10
        return result
      })
    })

    return results[0].map((item, index) => {
      const mergedItem: AttributeResult = { name: item.name }
      attribute.choices.forEach((attrChoice, i) => {
        const value = results[i][index][attrChoice.text]
        if (typeof value === 'number') {
          mergedItem[attrChoice.text] = value
        }
      })
      return mergedItem
    })
  }

  const currentResults: ResultType[] = selectedAttribute 
    ? getAttributeResults(selectedAttribute)
    : overallResults

  const selectedAttributeData = selectedAttribute
    ? survey.attributes.find(a => a.id === selectedAttribute)
    : null

  const getChartColors = (count: number) => {
    const baseColors = ['#2563eb', '#7c3aed', '#db2777', '#dc2626', '#ea580c', '#ca8a04']
    return Array(count).fill(0).map((_, i) => baseColors[i % baseColors.length])
  }

  const renderAttributeCell = (result: AttributeResult, choice: { text: string }) => {
    const value = result[choice.text]
    return typeof value === 'number' ? `${value}%` : '-'
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">アンケート結果</h2>
      
      {/* 属性選択 */}
      {survey.attributes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            属性別に表示
          </label>
          <select
            value={selectedAttribute || ''}
            onChange={(e) => setSelectedAttribute(e.target.value || null)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">全体の結果</option>
            {survey.attributes.map((attribute) => (
              <option key={attribute.id} value={attribute.id}>
                {attribute.title}による分析
              </option>
            ))}
          </select>
        </div>
      )}

      {/* グラフ表示 */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={currentResults}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis 
              label={{ value: '%', position: 'insideTop', offset: -10 }}
              domain={[0, 100]}
            />
            <Tooltip />
            <Legend />
            {selectedAttributeData ? (
              selectedAttributeData.choices.map((choice, index) => (
                <Bar
                  key={choice.id}
                  dataKey={choice.text}
                  fill={getChartColors(survey.choices.length)[index]}
                />
              ))
            ) : (
              <Bar dataKey="percentage" fill="#2563eb" />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 数値での表示 */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">集計結果</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  選択肢
                </th>
                {selectedAttributeData ? (
                  selectedAttributeData.choices.map(choice => (
                    <th
                      key={choice.id}
                      className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {choice.text}
                    </th>
                  ))
                ) : (
                  <>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      回答数
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      割合
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentResults.map((result, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.name}
                  </td>
                  {selectedAttributeData ? (
                    selectedAttributeData.choices.map(choice => (
                      <td
                        key={choice.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {renderAttributeCell(result as AttributeResult, choice)}
                      </td>
                    ))
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(result as OverallResult).count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(result as OverallResult).percentage}%
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}