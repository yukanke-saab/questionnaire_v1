import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import ShareSurvey from '@/components/ShareSurvey'
import SurveyResponse from '@/components/SurveyResponse'
import SurveyResults from '@/components/SurveyResults'
import SurveyComments from '@/components/SurveyComments'
import { authOptions } from '@/lib/auth'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Survey } from '@/types/survey'

export default async function SurveyPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  const surveyData = await prisma.survey.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          twitter_id: true,
          created_at: true,
          updated_at: true,
          email: true,
          emailVerified: true,
        }
      },
      choices: {
        orderBy: { order: 'asc' },
      },
      attributes: {
        include: {
          choices: {
            orderBy: { order: 'asc' },
          },
        },
      },
      responses: {
        include: {
          attributes: true,
        },
      },
      comments: {
        orderBy: {
          created_at: 'desc',
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
              twitter_id: true,
            },
          },
        },
      },
      _count: {
        select: {
          responses: true
        }
      }
    },
  })

  if (!surveyData) {
    return notFound()
  }

  // 型アサーション
  const survey = surveyData as unknown as Survey

  const hasResponded = survey.responses?.some(r => r.userId === session?.user?.id)
  const isCreator = session?.user?.id === survey.userId

  const formattedDate = new Date(survey.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">{survey.title}</h1>
        <div className="flex items-center gap-4 mb-4">
          {survey.user.twitter_id ? (
            <Link 
              href={`https://twitter.com/${survey.user.twitter_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-blue-500"
            >
              {survey.user.image && (
                <Image
                  src={survey.user.image}
                  alt={survey.user.name || '作成者のプロフィール画像'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div className="flex flex-col">
                <span className="font-medium">{survey.user.name}</span>
                <span className="text-sm text-gray-500">@{survey.user.twitter_id}</span>
              </div>
            </Link>
          ) : (
            <div className="flex items-center space-x-2">
              {survey.user.image && (
                <Image
                  src={survey.user.image}
                  alt={survey.user.name || '作成者のプロフィール画像'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div className="flex flex-col">
                <span className="font-medium">{survey.user.name}</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>回答数: {survey._count?.responses ?? 0}件</span>
          <span>•</span>
          <time dateTime={survey.created_at.toISOString()}>{formattedDate}</time>
        </div>
      </div>
      
      {/* 結果表示（回答済みまたは作成者の場合のみ） */}
      {(hasResponded || isCreator) ? (
        <SurveyResults survey={survey} />
      ) : (
        <SurveyResponse survey={survey} />
      )}
      
      {/* コメント表示（ログインしていなくても閲覧可能） */}
      <SurveyComments 
        surveyId={survey.id} 
        initialComments={survey.comments} 
      />

      {/* 共有ボタン（常に表示） */}
      <ShareSurvey surveyId={survey.id} title={survey.title} />
    </div>
  )
}