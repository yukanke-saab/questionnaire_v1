import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const title = searchParams.get('title')

    console.log('Generating thumbnail for:', title)

    if (!title) {
      return new Response('Title is required', { status: 400 })
    }

    const thumbnail = new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(45deg, #FFB6C1, #FFE4E1, #E6E6FA)',
            width: '1200',
            height: '630',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            fontFamily: 'M PLUS Rounded 1c',
          }}
        >
          {/* 装飾的な要素（左上） */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            fontSize: '60px',
          }}>
            ✨
          </div>

          {/* 装飾的な要素（右上） */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            fontSize: '60px',
          }}>
            ✨
          </div>

          {/* メインコンテンツ */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '50px',
              borderRadius: '30px',
              maxWidth: '90%',
              border: '4px solid #FFF',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* タイトル前の装飾 */}
            <div style={{
              fontSize: '40px',
              marginBottom: '20px',
            }}>
              📝
            </div>

            {/* タイトル */}
            <div
              style={{
                fontSize: '48px',
                color: '#5C5C5C',
                textAlign: 'center',
                fontWeight: 'bold',
                marginBottom: '20px',
                wordBreak: 'break-word',
                lineHeight: 1.4,
              }}
            >
              {title}
            </div>

            {/* サブテキスト */}
            <div
              style={{
                fontSize: '28px',
                color: '#888',
                marginTop: '20px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span>アンケートに答えてください</span>
              <span style={{ fontSize: '32px' }}>💭</span>
            </div>
          </div>

          {/* 装飾的な要素（左下） */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            fontSize: '60px',
          }}>
            ✨
          </div>

          {/* 装飾的な要素（右下） */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            fontSize: '60px',
          }}>
            ✨
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      }
    )

    console.log('Thumbnail generated successfully')
    return thumbnail

  } catch (error) {
    console.error('Thumbnail generation error:', error)
    return new Response('Failed to generate thumbnail', { status: 500 })
  }
}