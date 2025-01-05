'use client'

import { useState, useMemo } from 'react'
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
  [key: string]: number | string
  totalResponses?: number // ソート用に追加
}

type ResultType = OverallResult | AttributeResult

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if ('count' in data) {
      return (
        <div className="bg-white p-2 shadow rounded border">
          <p className="font-medium">{label}</p>
          <p className="text-gray-600">回答数: {data.count}人</p>
          <p className="text-gray-600">割合: {data.percentage.toFixed(1)}%</p>
        </div>
      );
    } else {
      return (
        <div className="bg-white p-2 shadow rounded border">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any) => (
            <p key={entry.name} className="text-gray-600" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}%
            </p>
          ))}
        </div>
      );
    }
  }
  return null;
};

export default function SurveyResults({ survey }: SurveyResultsProps) {
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null)

  // 基本の集計データを作成し、回答数順にソート
  const overallResults: OverallResult[] = useMemo(() => {
    const results = survey.choices.map(choice => {
      const count = survey.responses.filter(r => r.choiceId === choice.id).length
      const percentage = (count / Math.max(survey.responses.length, 1)) * 100

      return {
        name: choice.text || '画像のみの選択肢',
        count,
        percentage: Math.round(percentage * 10) / 10
      }
    })

    // 回答数の降順でソート
    return results.sort((a, b) => b.count - a.count)
  }, [survey])

  // 属性別のクロス集計データを作成
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

        return {
          name: choice.text || '画像のみの選択肢',
          [attrChoice.text]: Math.round(percentage * 10) / 10,
          totalResponses: count // この属性における合計回答数
        }
      })
    })

    // 合計回答数を計算してソート用に使用
    const mergedResults = results[0].map((item, index) => {
      const mergedItem: AttributeResult = { 
        name: item.name,
        totalResponses: 0
      }
      attribute.choices.forEach((attrChoice, i) => {
        const value = results[i][index][attrChoice.text]
        if (typeof value === 'number') {
          mergedItem[attrChoice.text] = value
          // 各属性の回答数を合計
          mergedItem.totalResponses! += results[i][index].totalResponses || 0
        }
      })
      return mergedItem
    })

    // 合計回答数の降順でソート
    return mergedResults.sort((a, b) => (b.totalResponses || 0) - (a.totalResponses || 0))
  }

  const currentResults = selectedAttribute 
    ? getAttributeResults(selectedAttribute)
    : overallResults

  const getChartColors = (count: number) => {
    const baseColors = ['#2563eb', '#7c3aed', '#db2777', '#dc2626', '#ea580c', '#ca8a04']
    return Array(count).fill(0).map((_, i) => baseColors[i % baseColors.length])
  }

  const selectedAttributeData = selectedAttribute
    ? survey.attributes.find(a => a.id === selectedAttribute)
    : null

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
          <BarChart
            data={currentResults}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={150}
            />
            <Tooltip content={<CustomTooltip />} />
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
                        {result[choice.text]}%
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