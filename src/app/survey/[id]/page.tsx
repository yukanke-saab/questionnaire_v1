import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import ShareSurvey from '@/components/ShareSurvey'
import SurveyResponse from '@/components/SurveyResponse'
import SurveyResults from '@/components/SurveyResults'
import { authOptions } from '@/lib/auth'
import { notFound } from 'next/navigation'

export default async function SurveyPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  const survey = await prisma.survey.findUnique({
    where: { id },
    include: {
      user: true,
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
      responses: session?.user?.id ? {
        where: {
          OR: [
            { userId: session.user.id },
            { survey: { userId: session.user.id } }
          ]
        },
        include: {
          attributes: true,
        },
      } : undefined,
    },
  })

  if (!survey) {
    return notFound()
  }

  const hasResponded = !!survey.responses?.some(r => r.userId === session?.user?.id)
  const isCreator = session?.user?.id === survey.userId

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{survey.title}</h1>
      
      {/* 結果表示（回答済みまたは作成者の場合のみ） */}
      {(hasResponded || isCreator) ? (
        <SurveyResults survey={survey} />
      ) : (
        <SurveyResponse survey={survey} />
      )}
      
      {/* 共有ボタン（作成者または未回答者のみ表示） */}
      {(isCreator || !hasResponded) && (
        <ShareSurvey surveyId={survey.id} title={survey.title} />
      )}
    </div>
  )
}