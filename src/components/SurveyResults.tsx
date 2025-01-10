'use client'

import React, { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import type { Survey } from '@/types/survey'
import Image from 'next/image'

interface SurveyResultsProps {
  survey: Survey
}

interface OverallResult {
  name: string
  count: number
  percentage: number
  image_url?: string | null
  [key: string]: string | number | null | undefined
}

interface AttributeResult {
  name: string
  totalResponses?: number
  image_url?: string | null
  [key: string]: string | number | null | undefined
}

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#dc2626', '#ea580c', '#ca8a04', '#65a30d', '#0d9488']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white p-2 shadow rounded border">
        <p className="font-medium">{label}</p>
        <p className="text-gray-600">回答数: {data.count}人</p>
        <p className="text-gray-600">割合: {data.percentage.toFixed(1)}%</p>
      </div>
    )
  }
  return null
}

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 shadow rounded border">
        {payload[0].payload.image_url && (
          <div className="mb-2">
            <Image
              src={payload[0].payload.image_url}
              alt="選択肢の画像"
              width={120}
              height={90}
              className="rounded"
            />
          </div>
        )}
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-gray-600">回答数: {payload[0].value}人</p>
        <p className="text-gray-600">割合: {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%</p>
      </div>
    )
  }
  return null
}

const CustomBarLabel = (props: any) => {
  const { x, y, width, value } = props
  return (
    <text
      x={x + width + 5}
      y={y + 15}
      fill="#666"
      textAnchor="start"
      fontSize={12}
      className="font-medium"
    >
      {`${value.toFixed(1)}%`}
    </text>
  )
}

const getAttributeResults = (survey: Survey, attributeId: string) => {
  const attribute = survey.attributes.find(a => a.id === attributeId)
  if (!attribute) return []

  return attribute.choices.map(attrChoice => {
    const responses = survey.responses.filter(r =>
      r.attributes.some(a =>
        a.attributeSettingId === attributeId &&
        a.attributeChoiceId === attrChoice.id
      )
    )

    const choiceCounts = survey.choices.map(choice => {
      const count = responses.filter(r => r.choiceId === choice.id).length
      return {
        name: choice.text || '画像のみの選択肢',
        value: count,
        total: responses.length,
        image_url: choice.image_url
      }
    }).filter(item => item.value > 0)

    return {
      attributeChoice: attrChoice.text,
      data: choiceCounts
    }
  }).filter(group => group.data.length > 0)
}

export default function SurveyResults({ survey }: SurveyResultsProps) {
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null)

  const overallResults: OverallResult[] = useMemo(() => {
    const results = survey.choices.map(choice => {
      const count = survey.responses.filter(r => r.choiceId === choice.id).length
      const percentage = (count / Math.max(survey.responses.length, 1)) * 100

      return {
        name: choice.text || '画像のみの選択肢',
        count,
        percentage: Math.round(percentage * 10) / 10,
        image_url: choice.image_url
      }
    })

    return results.sort((a, b) => b.count - a.count)
  }, [survey])

  const selectedAttributeData = selectedAttribute 
    ? getAttributeResults(survey, selectedAttribute)
    : []

  const selectedAttributeInfo = selectedAttribute 
    ? survey.attributes.find(a => a.id === selectedAttribute)
    : null

  const renderGraphSection = () => {
    if (selectedAttribute && selectedAttributeData.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedAttributeData.map(({ attributeChoice, data }) => (
            <div key={attributeChoice} className="h-[300px]">
              <h3 className="text-lg font-medium mb-4 text-center">{attributeChoice}</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                    labelLine={true}
                    startAngle={90}
                    endAngle={450}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-500 text-center mt-2">
                回答者数: {data[0]?.total || 0}人
              </p>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="flex mt-4">
        <div className="w-40 md:w-60 py-12 flex-shrink-0 space-y-8">
          {overallResults.map((result) => (
            <div 
              key={result.name} 
              style={{ height: '80px' }}
              className="flex items-center"
            >
              <div className="w-full px-2">
                {result.image_url ? (
                  <div className="relative w-32 md:w-48 h-20 md:h-24">
                    <Image
                      src={result.image_url}
                      alt={result.name}
                      fill
                      className="object-contain rounded"
                      sizes="(max-width: 768px) 128px, 192px"
                    />
                  </div>
                ) : (
                  <div className="text-sm text-gray-900">
                    {result.name}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={overallResults}
              layout="vertical"
              margin={{ top: 5, right: 50, left: 5, bottom: 5 }}
              barSize={30}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={0}
                tick={false}
                axisLine={false}
              />
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="percentage"
                fill="#2563eb"
                label={<CustomBarLabel />}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl font-semibold">アンケート結果</h2>
      
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

      {renderGraphSection()}

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">集計結果</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  選択肢
                </th>
                {selectedAttribute && selectedAttributeInfo ? (
                  selectedAttributeInfo.choices.map(attrChoice => (
                    <React.Fragment key={attrChoice.id}>
                      <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                        {attrChoice.text}
                      </th>
                    </React.Fragment>
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
              {selectedAttribute && (
                <tr>
                  <th className="px-6 py-3 bg-gray-50"></th>
                  {selectedAttributeInfo?.choices.map(attrChoice => (
                    <React.Fragment key={attrChoice.id}>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        回答数
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        割合
                      </th>
                    </React.Fragment>
                  ))}
                </tr>
              )}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedAttribute && selectedAttributeInfo ? (
                overallResults.map((result, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-4">
                        {result.image_url && (
                          <div className="relative w-20 h-16">
                            <Image
                              src={result.image_url}
                              alt={result.name}
                              fill
                              className="object-contain rounded"
                              sizes="80px"
                            />
                          </div>
                        )}
                        <span>{result.name}</span>
                      </div>
                    </td>
                    {selectedAttributeInfo.choices.map((attrChoice) => {
                      const responses = survey.responses.filter(r =>
                        r.attributes.some(a =>
                          a.attributeSettingId === selectedAttribute &&
                          a.attributeChoiceId === attrChoice.id
                        )
                      )
                      const count = responses.filter(r => r.choiceId === survey.choices[index].id).length
                      const percentage = responses.length > 0 
                        ? (count / responses.length) * 100 
                        : 0
                      
                      return (
                        <React.Fragment key={attrChoice.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {percentage.toFixed(1)}%
                          </td>
                        </React.Fragment>
                      )
                    })}
                  </tr>
                ))
              ) : (
                overallResults.map((result, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-4">
                        {result.image_url && (
                          <div className="relative w-20 h-16">
                            <Image
                              src={result.image_url}
                              alt={result.name}
                              fill
                              className="object-contain rounded"
                              sizes="80px"
                            />
                          </div>
                        )}
                        <span>{result.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.percentage}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}