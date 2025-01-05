import { getServerSession } from 'next-auth'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

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
          <Link
            key={survey.id}
            href={`/survey/${survey.id}`}
            className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2 line-clamp-2">
              {survey.title}
            </h2>
            <div className="text-sm text-gray-600 mb-3">
              作成者: {survey.user.name}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                回答数: {survey._count.responses}
              </span>
              {session?.user?.id && survey.responses.length > 0 && (
                <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                  回答済み
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {new Date(survey.created_at).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </Link>
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