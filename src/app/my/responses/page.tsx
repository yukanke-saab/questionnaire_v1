import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import SurveyCard from '@/components/SurveyCard'

export default async function MyResponsesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const responses = await prisma.response.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      survey: {
        select: {
          id: true,
          title: true,
          created_at: true,
          user: {
            select: {
              name: true,
              image: true,
              twitter_id: true,
            },
          },
          _count: {
            select: {
              responses: true,
            },
          },
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">回答したアンケート</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {responses.map(({ survey }) => (
          <SurveyCard
            key={survey.id}
            id={survey.id}
            title={survey.title}
            createdAt={survey.created_at}
            author={survey.user}
            responseCount={survey._count.responses}
            hasResponded={true}
          />
        ))}
      </div>

      {responses.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          まだアンケートに回答していません
        </div>
      )}
    </div>
  )
}