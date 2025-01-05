import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import Link from 'next/link'

export default async function MyResponsesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const responses = await prisma.response.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      created_at: 'desc',
    },
    include: {
      survey: true,
      choice: true,
    },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">回答したアンケート一覧</h1>
      
      <div className="grid gap-4">
        {responses.map((response) => (
          <Link
            key={response.id}
            href={`/survey/${response.survey.id}`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{response.survey.title}</h2>
            <div className="text-sm text-gray-600 mb-2">
              回答: {response.choice.text || '画像選択'}
            </div>
            <div className="text-sm text-gray-600">
              回答日: {new Date(response.created_at).toLocaleDateString()}
            </div>
          </Link>
        ))}

        {responses.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            まだアンケートに回答していません
          </div>
        )}
      </div>
    </div>
  )
}