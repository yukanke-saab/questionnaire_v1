import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession()

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { surveyId, choiceId, attributes } = await req.json()

    // ユーザーが既に回答済みかチェック
    const existingResponse = await prisma.response.findUnique({
      where: {
        userId_surveyId: {
          userId: session.user.id,
          surveyId,
        },
      },
    })

    if (existingResponse) {
      return new NextResponse('Already responded', { status: 400 })
    }

    // 回答を作成
    const response = await prisma.response.create({
      data: {
        surveyId,
        userId: session.user.id,
        choiceId,
        attributes: {
          create: attributes.map((attr: any) => ({
            attributeSettingId: attr.attributeId,
            attributeChoiceId: attr.choiceId,
          })),
        },
      },
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error creating response:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}