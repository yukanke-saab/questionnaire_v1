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
            background: 'linear-gradient(to bottom right, #2563eb, #7c3aed)',
            width: '1200',
            height: '630',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '40px',
              borderRadius: '20px',
              maxWidth: '90%',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                color: 'white',
                textAlign: 'center',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                wordBreak: 'break-word',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: '24px',
                color: 'rgba(255, 255, 255, 0.9)',
                marginTop: '20px',
                textAlign: 'center',
              }}
            >
              アンケートに答えてください
            </div>
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