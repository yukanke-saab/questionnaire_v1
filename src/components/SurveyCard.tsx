'use client'

import Image from 'next/image'
import TwitterAuthorLink from './TwitterAuthorLink'

interface SurveyCardProps {
  id: string
  title: string
  createdAt: Date
  votingEnd?: Date | null
  author: {
    name: string | null
    image: string | null
    twitter_id: string | null
  }
  responseCount: number
  hasResponded?: boolean
  thumbnailUrl?: string | null
}

function getTimeRemaining(votingEnd: Date) {
  const now = new Date()
  const timeUntilEnd = new Date(votingEnd).getTime() - now.getTime()
  
  // ミリ秒を時間に変換
  const hoursRemaining = Math.ceil(timeUntilEnd / (1000 * 60 * 60))

  if (hoursRemaining <= 0) {
    return { isExpired: true, hours: 0 }
  }

  return { 
    isExpired: false, 
    hours: hoursRemaining 
  }
}

export default function SurveyCard({
  id,
  title,
  createdAt,
  votingEnd,
  author,
  responseCount,
  hasResponded = false,
  thumbnailUrl,
}: SurveyCardProps) {
  const timeInfo = votingEnd ? getTimeRemaining(votingEnd) : null

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

            <div className="flex flex-col gap-1">
              <time dateTime={createdAt.toISOString()} className="text-xs text-gray-500">
                作成日: {new Date(createdAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              
              {timeInfo && (
                <div className="flex items-center gap-2">
                  <time 
                    dateTime={votingEnd?.toISOString()} 
                    className={`text-xs ${timeInfo.isExpired ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    {timeInfo.isExpired 
                      ? '投票期限: 投票終了'
                      : `投票期限: 残り${timeInfo.hours}時間`
                    }
                  </time>
                  {!timeInfo.isExpired && timeInfo.hours < 24 && (
                    <span className="inline-block px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">
                      まもなく終了
                    </span>
                  )}
                </div>
              )}
            </div>
          </footer>
        </div>
      </article>
    </a>
  )
}