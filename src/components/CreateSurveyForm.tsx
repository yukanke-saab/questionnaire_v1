'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type ChoiceType = 'TEXT_ONLY' | 'TEXT_WITH_IMAGE' | 'IMAGE_ONLY'

interface Choice {
  text?: string
  imageUrl?: string
  file?: File
}

interface AttributeChoice {
  text: string
}

interface CustomAttribute {
  title: string
  choices: AttributeChoice[]
}

export default function CreateSurveyForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [choiceType, setChoiceType] = useState<ChoiceType>('TEXT_ONLY')
  const [choices, setChoices] = useState<Choice[]>([{ text: '' }, { text: '' }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // 属性設定の状態
  const [useAge, setUseAge] = useState(false)
  const [useGender, setUseGender] = useState(false)
  const [useLocation, setUseLocation] = useState(false)
  const [customAttributes, setCustomAttributes] = useState<CustomAttribute[]>([])
  const [votingEndDays, setVotingEndDays] = useState('1')
const [votingEndHours, setVotingEndHours] = useState('0')
const [votingEndMinutes, setVotingEndMinutes] = useState('0')

  const handleAddChoice = () => {
    if (choices.length < 10) {
      setChoices([...choices, choiceType === 'TEXT_ONLY' ? { text: '' } : { text: '', imageUrl: '' }])
    }
  }

  const handleRemoveChoice = (index: number) => {
    if (choices.length > 2) {
      setChoices(choices.filter((_, i) => i !== index))
    }
  }

  const handleChoiceTextChange = (index: number, text: string) => {
    const newChoices = [...choices]
    newChoices[index] = { ...newChoices[index], text }
    setChoices(newChoices)
  }

  const handleImageUpload = async (index: number, file: File) => {
    try {
      const newChoices = [...choices]
      newChoices[index] = { ...newChoices[index], file }
      setChoices(newChoices)
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  // カスタム属性の操作
  const handleAddCustomAttribute = () => {
    setCustomAttributes([...customAttributes, { title: '', choices: [{ text: '' }] }])
  }

  const handleRemoveCustomAttribute = (index: number) => {
    setCustomAttributes(customAttributes.filter((_, i) => i !== index))
  }

  const handleCustomAttributeTitleChange = (index: number, title: string) => {
    const newAttributes = [...customAttributes]
    newAttributes[index].title = title
    setCustomAttributes(newAttributes)
  }

  const handleAddCustomChoice = (attributeIndex: number) => {
    if (customAttributes[attributeIndex].choices.length < 10) {
      const newAttributes = [...customAttributes]
      newAttributes[attributeIndex].choices.push({ text: '' })
      setCustomAttributes(newAttributes)
    }
  }

  const handleRemoveCustomChoice = (attributeIndex: number, choiceIndex: number) => {
    if (customAttributes[attributeIndex].choices.length > 1) {
      const newAttributes = [...customAttributes]
      newAttributes[attributeIndex].choices = newAttributes[attributeIndex].choices.filter(
        (_, i) => i !== choiceIndex
      )
      setCustomAttributes(newAttributes)
    }
  }

  const handleCustomChoiceTextChange = (
    attributeIndex: number,
    choiceIndex: number,
    text: string
  ) => {
    const newAttributes = [...customAttributes]
    newAttributes[attributeIndex].choices[choiceIndex].text = text
    setCustomAttributes(newAttributes)
  }

  const handleTimeChange = (
    value: string,
    setter: (value: string) => void,
    max: number
  ) => {
    if (value === '' || /^\d+$/.test(value)) {
      const numValue = parseInt(value || '0')
      if (numValue <= max) {
        setter(value)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('choiceType', choiceType)
      formData.append('choices', JSON.stringify(choices))

      const days = parseInt(votingEndDays) || 0
const hours = parseInt(votingEndHours) || 0
const minutes = parseInt(votingEndMinutes) || 0

const votingEnd = new Date()
votingEnd.setDate(votingEnd.getDate() + days)
votingEnd.setHours(votingEnd.getHours() + hours)
votingEnd.setMinutes(votingEnd.getMinutes() + minutes)

formData.append('votingEnd', votingEnd.toISOString())
      
      // 属性設定の追加
      formData.append('attributes', JSON.stringify({
        useAge,
        useGender,
        useLocation,
        customAttributes
      }))

      const response = await fetch('/api/surveys', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to create survey')

      const data = await response.json()
      router.push(`/survey/${data.surveyId}`)
    } catch (error) {
      console.error('Error creating survey:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* アンケートタイトル */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          アンケートタイトル
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* 選択肢タイプ */}
      <div>
        <label className="block text-sm font-medium text-gray-700">選択肢タイプ</label>
        <select
          value={choiceType}
          onChange={(e) => setChoiceType(e.target.value as ChoiceType)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="TEXT_ONLY">テキストのみ</option>
          <option value="TEXT_WITH_IMAGE">テキスト + 画像</option>
          <option value="IMAGE_ONLY">画像のみ</option>
        </select>
      </div>

      {/* 選択肢 */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">選択肢</label>
        {choices.map((choice, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-grow">
              {choiceType !== 'IMAGE_ONLY' && (
                <input
                  type="text"
                  value={choice.text}
                  onChange={(e) => handleChoiceTextChange(index, e.target.value)}
                  placeholder={`選択肢 ${index + 1}`}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              )}
              {(choiceType === 'TEXT_WITH_IMAGE' || choiceType === 'IMAGE_ONLY') && (
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(index, file)
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              )}
            </div>
            {choices.length > 2 && (
              <button
                type="button"
                onClick={() => handleRemoveChoice(index)}
                className="text-red-600 hover:text-red-800"
              >
                削除
              </button>
            )}
          </div>
        ))}
        {choices.length < 10 && (
          <button
            type="button"
            onClick={handleAddChoice}
            className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            選択肢を追加
          </button>
        )}
      </div>

      {/* 回答者属性設定 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">回答者属性設定（任意）</h3>
        
        {/* 基本属性 */}
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useAge"
              checked={useAge}
              onChange={(e) => setUseAge(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="useAge" className="ml-2 text-sm text-gray-700">
              年代
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useGender"
              checked={useGender}
              onChange={(e) => setUseGender(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="useGender" className="ml-2 text-sm text-gray-700">
              性別
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useLocation"
              checked={useLocation}
              onChange={(e) => setUseLocation(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="useLocation" className="ml-2 text-sm text-gray-700">
              居住地（都道府県）
            </label>
          </div>
        </div>

        {/* カスタム属性 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">カスタム属性</h4>
            <button
              type="button"
              onClick={handleAddCustomAttribute}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              属性を追加
            </button>
          </div>
          
          {customAttributes.map((attribute, attributeIndex) => (
            <div key={attributeIndex} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-start justify-between">
                <input
                  type="text"
                  value={attribute.title}
                  onChange={(e) => handleCustomAttributeTitleChange(attributeIndex, e.target.value)}
                  placeholder="属性名"
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCustomAttribute(attributeIndex)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  削除
                </button>
              </div>

              {/* 選択肢 */}
              <div className="space-y-2">
                {attribute.choices.map((choice, choiceIndex) => (
                  <div key={choiceIndex} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={choice.text}
                      onChange={(e) =>
                        handleCustomChoiceTextChange(attributeIndex, choiceIndex, e.target.value)
                      }
                      placeholder={`選択肢 ${choiceIndex + 1}`}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {attribute.choices.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomChoice(attributeIndex, choiceIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        削除
                      </button>
                    )}
                  </div>
                ))}
                {attribute.choices.length < 10 && (
                  <button
                    type="button"
                    onClick={() => handleAddCustomChoice(attributeIndex)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + 選択肢を追加
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
  <h3 className="text-lg font-medium text-gray-900">投票期限設定</h3>
  <div className="flex items-end gap-4">
    <div>
      <label htmlFor="votingEndDays" className="block text-sm text-gray-700">
        日
      </label>
      <select
        id="votingEndDays"
        value={votingEndDays}
        onChange={(e) => setVotingEndDays(e.target.value)}
        className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {[...Array(31)].map((_, i) => (
          <option key={i} value={i}>{i}</option>
        ))}
      </select>
    </div>
    <div>
      <label htmlFor="votingEndHours" className="block text-sm text-gray-700">
        時間
      </label>
      <select
        id="votingEndHours"
        value={votingEndHours}
        onChange={(e) => setVotingEndHours(e.target.value)}
        className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {[...Array(24)].map((_, i) => (
          <option key={i} value={i}>{i}</option>
        ))}
      </select>
    </div>
    <div>
      <label htmlFor="votingEndMinutes" className="block text-sm text-gray-700">
        分
      </label>
      <select
        id="votingEndMinutes"
        value={votingEndMinutes}
        onChange={(e) => setVotingEndMinutes(e.target.value)}
        className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {[...Array(60)].map((_, i) => (
          <option key={i} value={i}>{i}</option>
        ))}
      </select>
    </div>
    <div className="text-sm text-gray-500 ml-2">
      後に終了
    </div>
  </div>
</div>

      {/* 送信ボタン */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {isSubmitting ? '作成中...' : 'アンケートを作成'}
        </button>
      </div>
    </form>
  )
}