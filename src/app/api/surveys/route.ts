import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { storage } from '@/lib/storage'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const formData = await req.formData()
    const title = formData.get('title') as string
    const choiceType = formData.get('choiceType') as string
    const choicesData = JSON.parse(formData.get('choices') as string)
    const attributesData = JSON.parse(formData.get('attributes') as string)
    const votingEnd = formData.get('votingEnd') as string

    // ベースURLの取得
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                   'http://localhost:3000')

    // サムネイル画像のURLを生成
    const thumbnailUrl = `${baseUrl}/api/thumbnail?title=${encodeURIComponent(title)}`
    console.log('Generated thumbnail URL:', thumbnailUrl)

    // 画像のアップロード処理
    const choicesWithUrls = await Promise.all(
      choicesData.map(async (choice: any, index: number) => {
        if (choice.file) {
          const file = formData.get(`file_${index}`) as File
          if (file) {
            // ファイルをBufferに変換
            const buffer = Buffer.from(await file.arrayBuffer())
            const filename = `${session.user.id}_${Date.now()}_${file.name}`
            const url = await storage.uploadFile(buffer, filename, file.type)
            
            return { 
              ...choice,
              image_url: url,
              text: choice.text || null
            }
          }
        }
        return {
          ...choice,
          image_url: null,
          text: choice.text || null
        }
      })
    )

    // アンケートの作成
    const survey = await prisma.survey.create({
      data: {
        title,
        choice_type: choiceType,
        userId: session.user.id,
        thumbnail_url: thumbnailUrl,
        votingEnd: votingEnd ? new Date(votingEnd) : undefined,
        choices: {
          create: choicesWithUrls.map((choice: any, index: number) => ({
            text: choice.text,
            image_url: choice.image_url,
            order: index,
          })),
        },
        attributes: {
          create: [
            ...(attributesData.useAge ? [{
              type: 'AGE',
              title: '年代',
              choices: {
                create: ['10代以下', '20代', '30代', '40代', '50代', '60代以上'].map((text, index) => ({
                  text,
                  order: index,
                })),
              },
            }] : []),
            ...(attributesData.useGender ? [{
              type: 'GENDER',
              title: '性別',
              choices: {
                create: ['男性', '女性', 'その他', '回答しない'].map((text, index) => ({
                  text,
                  order: index,
                })),
              },
            }] : []),
            ...(attributesData.useLocation ? [{
              type: 'LOCATION',
              title: '居住地',
              choices: {
                create: ['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
                  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
                  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
                  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
                  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
                  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
                  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
                ].map((text, index) => ({
                  text,
                  order: index,
                })),
              },
            }] : []),
            ...attributesData.customAttributes.map((attr: any) => ({
              type: 'CUSTOM',
              title: attr.title,
              choices: {
                create: attr.choices.map((choice: any, index: number) => ({
                  text: choice.text,
                  order: index,
                })),
              },
            })),
          ],
        },
      },
      include: {
        choices: true,
        attributes: {
          include: {
            choices: true,
          },
        },
      },
    })

    return NextResponse.json({ surveyId: survey.id })
  } catch (error) {
    console.error('Error creating survey:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}