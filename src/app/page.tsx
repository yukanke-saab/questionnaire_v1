import { getServerSession } from 'next-auth'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import SurveyCard from '@/components/SurveyCard'

enum SortType {
  Latest = 'latest',
  Popular = 'popular'
}

export default async function Home({
  searchParams
}: {
  searchParams: { sort?: string }
}) {
  const session = await getServerSession(authOptions)
  const sortType = (searchParams.sort as SortType) || SortType.Latest

  const surveys = await prisma.survey.findMany({
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
      responses: session?.user?.id ? {
        where: {
          userId: session.user.id,
        },
        select: {
          id: true,
        },
      } : false,
    },
    orderBy: sortType === SortType.Latest 
      ? { created_at: 'desc' }
      : { responses: { _count: 'desc' }},
    take: 20,
  })

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          みんなのアンケート
        </h1>
        <div className="flex gap-4">
          <Link
            href="/"
            className={`px-4 py-2 rounded-lg ${
              sortType === SortType.Latest
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            新着順
          </Link>
          <Link
            href="/?sort=popular"
            className={`px-4 py-2 rounded-lg ${
              sortType === SortType.Popular
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            人気順
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {surveys.map((survey) => (
          <SurveyCard
            key={survey.id}
            id={survey.id}
            title={survey.title}
            createdAt={survey.created_at}
            author={survey.user}
            responseCount={survey._count.responses}
            hasResponded={survey.responses && survey.responses.length > 0}
          />
        ))}
      </div>

      {surveys.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          まだアンケートがありません
        </div>
      )}

      {session ? (
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
      ) : (
        <div className="fixed bottom-8 right-8">
          <Link
            href="/api/auth/signin"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
          >
            ログインしてアンケートを作成
          </Link>
        </div>
      )}
    </main>
  )
}