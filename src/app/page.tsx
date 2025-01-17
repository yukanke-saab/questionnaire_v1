import { getServerSession } from 'next-auth'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import SurveyCard from '@/components/SurveyCard'
import { ArrowRight } from 'lucide-react'

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
    <main className="container mx-auto px-4">
      {/* ヒーローセクション */}
      <section className="my-8 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 rounded-3xl shadow-sm border border-pink-100">
          <div className="px-6 py-12 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-base md:text-lg text-gray-600 mx-auto leading-relaxed">
                気になることを質問して、みんなの意見を集めよう。<br />
                アンケtonでは、画像付きの選択肢や属性別の分析など、手軽に本格的なアンケートが作れます。
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                {!session ? (
                  <Link
                    href="/api/auth/signin"
                    className="inline-flex items-center px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors text-base shadow-sm"
                  >
                    Twitterでログインして始める
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                ) : (
                  <Link
                    href="/create"
                    className="inline-flex items-center px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors text-base shadow-sm"
                  >
                    アンケートを作成する
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* アンケート一覧セクション */}
      <section className="pb-20">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            みんなのアンケート
          </h2>
          <div className="flex shadow-sm">
            <Link
              href="/"
              className={`whitespace-nowrap px-4 py-2 rounded-l-lg border-r ${
                sortType === SortType.Latest
                  ? 'bg-pink-500 text-white'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              新着順
            </Link>
            <Link
              href="/?sort=popular"
              className={`whitespace-nowrap px-4 py-2 rounded-r-lg ${
                sortType === SortType.Popular
                  ? 'bg-pink-500 text-white'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              人気順
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
            まだアンケートがありません
          </div>
        )}
      </section>

      {session ? (
        <Link
          href="/create"
          className="fixed bottom-8 right-8 bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition-colors"
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
      ) : null}
    </main>
  )
}