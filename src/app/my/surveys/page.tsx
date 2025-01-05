import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import Link from 'next/link'

export default async function MySurveysPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const surveys = await prisma.survey.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      created_at: 'desc',
    },
    include: {
      _count: {
        select: {
          responses: true,
        },
      },
    },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">作成したアンケート一覧</h1>
      
      <div className="grid gap-4">
        {surveys.map((survey) => (
          <Link
            key={survey.id}
            href={`/survey/${survey.id}`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{survey.title}</h2>
            <div className="flex justify-between text-sm text-gray-600">
              <span>回答数: {survey._count.responses}</span>
              <span>作成日: {new Date(survey.created_at).toLocaleDateString()}</span>
            </div>
          </Link>
        ))}

        {surveys.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            まだアンケートを作成していません
          </div>
        )}
      </div>

      <div className="mt-8">
        <Link
          href="/create"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          新しいアンケートを作成
        </Link>
      </div>
    </div>
  )
}