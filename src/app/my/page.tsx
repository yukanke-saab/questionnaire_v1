import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import SurveyCard from '@/components/SurveyCard'

enum FilterType {
  Created = 'created',
  Responded = 'responded'
}

export default async function MyPage({
  searchParams
}: {
  searchParams: { filter?: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect('/api/auth/signin')
  }

  const filterType = (searchParams.filter as FilterType) || FilterType.Created

  const surveys = await (filterType === FilterType.Created
    ? prisma.survey.findMany({
        where: {
          userId: session.user.id
        },
        select: {
          id: true,
          title: true,
          thumbnail_url: true,
          created_at: true,
          votingEnd: true,
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
          responses: {
            where: {
              userId: session.user.id,
            },
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc'
        },
      })
    : prisma.response.findMany({
        where: {
          userId: session.user.id
        },
        select: {
          survey: {
            select: {
              id: true,
              title: true,
              thumbnail_url: true,
              created_at: true,
              votingEnd: true,
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
              responses: {
                where: {
                  userId: session.user.id,
                },
                select: {
                  id: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: 'desc'
        },
      }).then(responses => responses.map(r => r.survey)))

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold whitespace-nowrap">
          マイページ
        </h1>
        <div className="flex">
          <Link
            href="/my"
            className={`whitespace-nowrap px-4 py-2 rounded-l-lg border-r ${
              filterType === FilterType.Created
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            作成したアンケート
          </Link>
          <Link
            href="/my?filter=responded"
            className={`whitespace-nowrap px-4 py-2 rounded-r-lg ${
              filterType === FilterType.Responded
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            回答したアンケート
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {surveys.map((survey) => (
          <SurveyCard
            key={survey.id}
            id={survey.id}
            title={survey.title}
            thumbnailUrl={survey.thumbnail_url}
            createdAt={survey.created_at}
            votingEnd={survey.votingEnd}
            author={survey.user}
            responseCount={survey._count.responses}
            hasResponded={survey.responses && survey.responses.length > 0}
          />
        ))}
      </div>

      {surveys.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          {filterType === FilterType.Created
            ? 'まだアンケートを作成していません'
            : 'まだアンケートに回答していません'
          }
        </div>
      )}

      {filterType === FilterType.Created && (
        <Link
          href="/create"
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </Link>
      )}
    </main>
  )
}