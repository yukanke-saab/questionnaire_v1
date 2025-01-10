import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import ShareSurvey from '@/components/ShareSurvey'
import SurveyResponse from '@/components/SurveyResponse'
import SurveyResults from '@/components/SurveyResults'
import SurveyComments from '@/components/SurveyComments'
import VotingStatus from '@/components/VotingStatus'
import TwitterUserLink from '@/components/TwitterUserLink'
import { authOptions } from '@/lib/auth'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Survey } from '@/types/survey'

interface PageProps {
  params: { 
    id: string 
  }
}

async function getSurveyData(id: string) {
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
    return null
  }

  return surveyData
}

export default async function SurveyPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)
  const surveyData = await getSurveyData(params.id)

  if (!surveyData) {
    return notFound()
  }

  const survey = surveyData as unknown as Survey
  const hasResponded = survey.responses?.some(r => r.userId === session?.user?.id)
  const isCreator = session?.user?.id === survey.userId
  const isVotingExpired = new Date(survey.votingEnd) <= new Date()

  const formattedDate = new Date(survey.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="space-y-4 mb-8">
        {survey.thumbnail_url ? (
          <div className="relative w-full aspect-[1200/630] rounded-lg overflow-hidden">
            <Image
              src={survey.thumbnail_url}
              alt={survey.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <h1 className="text-2xl font-bold">{survey.title}</h1>
        )}
        

        <div className="flex flex-row items-center gap-4">
          {survey.user.image && (
            <div className="flex-shrink-0">
              <Image
                src={survey.user.image}
                alt=""
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
          )}
          <div className="flex-grow">
            <div className="flex items-center gap-2">
              <span className="font-medium">{survey.user.name}</span>
              {survey.user.twitter_id && (
                <TwitterUserLink twitterId={survey.user.twitter_id} />
              )}
            </div>
            <div className="text-sm text-gray-600">
              <span>回答数: {survey._count?.responses ?? 0}件</span>
              <span className="mx-2">•</span>
              <time dateTime={survey.created_at.toISOString()}>{formattedDate}</time>
            </div>
          </div>
        </div>
      </div>

      <VotingStatus votingEnd={survey.votingEnd} />

      <div className="mt-8">
        {isVotingExpired || hasResponded || isCreator ? (
          <SurveyResults survey={survey} />
        ) : (
          <SurveyResponse survey={survey} />
        )}
      </div>

      <div className="mt-8">
        <SurveyComments 
          surveyId={survey.id} 
          initialComments={survey.comments} 
        />
      </div>

      <div className="mt-8">
        <ShareSurvey surveyId={survey.id} title={survey.title} />
      </div>
    </div>
  )
}