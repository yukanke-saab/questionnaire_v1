'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

interface Comment {
  id: string
  content: string
  created_at: Date
  user: {
    name: string | null
    image: string | null
    twitter_id: string | null
  }
}

interface SurveyCommentsProps {
  surveyId: string
  initialComments: Comment[]
}

export default function SurveyComments({ surveyId, initialComments }: SurveyCommentsProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // テキストエリアの高さを自動調整
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [newComment])

  // コメントを投稿
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user || !newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          surveyId,
          content: newComment.trim(),
        }),
      })

      if (!response.ok) throw new Error('Failed to post comment')

      const comment = await response.json()
      setComments(prev => [comment, ...prev])
      setNewComment('')
    } catch (error) {
      console.error('Failed to post comment:', error)
      alert('コメントの投稿に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 日付フォーマット
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-xl font-semibold">コメント</h3>

      {/* コメント入力フォーム */}
      {session?.user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="コメントを入力..."
              className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '投稿中...' : 'コメントを投稿'}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-gray-600">
          コメントを投稿するには
          <Link href="/api/auth/signin" className="text-blue-600 hover:underline">
            ログイン
          </Link>
          してください。
        </p>
      )}

      {/* コメント一覧 */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white p-4 rounded-lg border">
            <div className="flex items-start space-x-3">
              {comment.user.image && (
                <Image
                  src={comment.user.image}
                  alt={comment.user.name || ''}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div className="flex-1">
                <div className="flex items-baseline space-x-2">
                  {comment.user.twitter_id ? (
                    <Link
                      href={`https://twitter.com/${comment.user.twitter_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-blue-600"
                    >
                      {comment.user.name}
                    </Link>
                  ) : (
                    <span className="font-medium">{comment.user.name}</span>
                  )}
                  <span className="text-sm text-gray-500">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p className="mt-1 text-gray-800 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-4">まだコメントはありません。</p>
        )}
      </div>
    </div>
  )
}