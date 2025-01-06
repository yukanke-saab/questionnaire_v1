import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { surveyId, content } = await req.json()
    
    if (!surveyId || !content) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // コメントを作成
    const comment = await prisma.comment.create({
      data: {
        content,
        surveyId,
        userId: session.user.id,
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
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('[COMMENTS_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}