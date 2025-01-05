'use client'

import Link from 'next/link'
import Image from 'next/image'

interface SurveyCardProps {
  id: string
  title: string
  createdAt: Date
  author: {
    name: string | null
    image: string | null
    twitter_id: string | null
  }
  responseCount: number
  hasResponded?: boolean
}

export default function SurveyCard({
  id,
  title,
  createdAt,
  author,
  responseCount,
  hasResponded = false
}: SurveyCardProps) {
  return (
    <Link
      href={`/survey/${id}`}
      className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 mb-3">
        {author.image && (
          <Image
            src={author.image}
            alt={author.name || '作成者のプロフィール画像'}
            width={24}
            height={24}
            className="rounded-full"
          />
        )}
        <span className="text-sm text-gray-600">
          {author.twitter_id ? (
            <Link
              href={`https://twitter.com/${author.twitter_id}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hover:text-blue-500"
            >
              {author.name}
            </Link>
          ) : (
            author.name
          )}
        </span>
      </div>

      <h2 className="text-xl font-semibold mb-2 line-clamp-2">
        {title}
      </h2>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          回答数: {responseCount}
        </span>
        {hasResponded && (
          <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
            回答済み
          </span>
        )}
      </div>

      <div className="text-xs text-gray-500 mt-2">
        {new Date(createdAt).toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>
    </Link>
  )
}