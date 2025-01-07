import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  try {
    // 作成したアンケート
    const createdSurveys = userId ? await prisma.survey.findMany({
      where: {
        userId: userId
      },
      select: {
        id: true,
        title: true,
        thumbnail_url: true,
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
      orderBy: {
        created_at: 'desc'
      },
    }) : []

    // 回答したアンケート
    const respondedSurveys = userId ? await prisma.response.findMany({
      where: {
        userId: userId
      },
      select: {
        survey: {
          select: {
            id: true,
            title: true,
            thumbnail_url: true,
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
        created_at: 'desc'
      },
    }) : []

    return NextResponse.json({
      created: createdSurveys,
      responded: respondedSurveys.map(r => r.survey)
    })
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({ error: 'Failed to fetch surveys' }, { status: 500 })
  }
}