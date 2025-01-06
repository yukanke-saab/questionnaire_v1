import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createSurvey(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const title = formData.get('title') as string
    const choiceType = formData.get('choiceType') as string
    const choices = JSON.parse(formData.get('choices') as string)
    const attributes = JSON.parse(formData.get('attributes') as string)

    // ベースURLの取得部分をデバッグ
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                   'http://localhost:3000')

    console.log('Base URL:', baseUrl)

    // サムネイル画像のURLを生成
    const thumbnailUrl = `${baseUrl}/api/thumbnail?title=${encodeURIComponent(title)}`
    console.log('Generated thumbnail URL:', thumbnailUrl)

    const survey = await prisma.survey.create({
      data: {
        userId: session.user.id,
        title,
        choice_type: choiceType,
        thumbnail_url: thumbnailUrl,
        choices: {
          create: choices.map((choice: any, index: number) => ({
            text: choice.text,
            image_url: choice.imageUrl,
            order: index + 1,
          })),
        },
        attributes: {
          create: attributes.map((attribute: any) => ({
            type: attribute.type,
            title: attribute.title,
            choices: {
              create: attribute.choices.map((choice: any, choiceIndex: number) => ({
                text: choice.text,
                order: choiceIndex + 1,
              })),
            },
          })),
        },
      },
      // 作成したサーベイの全データを取得
      include: {
        choices: true,
        attributes: {
          include: {
            choices: true
          }
        }
      }
    })

    console.log('Created survey data:', {
      id: survey.id,
      title: survey.title,
      thumbnail_url: survey.thumbnail_url
    })

    revalidatePath('/')
    return { success: true, surveyId: survey.id }
  } catch (error) {
    console.error('Survey creation error:', error)
    return { success: false, error: String(error) }
  }
}