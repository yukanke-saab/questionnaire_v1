'use client'

import Image from 'next/image'
import TwitterAuthorLink from './TwitterAuthorLink'

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
  thumbnailUrl?: string | null
}

export default function SurveyCard({
  id,
  title,
  createdAt,
  author,
  responseCount,
  hasResponded = false,
  thumbnailUrl,
}: SurveyCardProps) {
  return (
    <a href={`/survey/${id}`} className="block">
      <article className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden">
        {thumbnailUrl ? (
          <div className="relative w-full aspect-[1200/630]">
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : null}
        
        <div className="p-6">
          {!thumbnailUrl && (
            <h2 className="text-xl font-semibold mb-4 line-clamp-2">
              {title}
            </h2>
          )}

          <header className="flex items-center gap-3 mb-3">
            {author.image && (
              <Image
                src={author.image}
                alt=""
                width={24}
                height={24}
                className="rounded-full flex-shrink-0"
              />
            )}
            <TwitterAuthorLink
              name={author.name}
              twitterId={author.twitter_id}
              className="text-sm text-gray-600 hover:text-blue-500"
            />
          </header>

          <footer>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                回答数: {responseCount}
              </span>
              {hasResponded && (
                <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                  回答済み
                </span>
              )}
            </div>

            <time dateTime={createdAt.toISOString()} className="text-xs text-gray-500">
              {new Date(createdAt).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </footer>
        </div>
      </article>
    </a>
  )
}