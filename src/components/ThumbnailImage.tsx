'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ThumbnailImageProps {
  src: string
  alt: string
  title: string
}

export default function ThumbnailImage({ src, alt, title }: ThumbnailImageProps) {
  const [error, setError] = useState(false)

  if (error) {
    return <h1 className="text-2xl font-bold mb-4">{title}</h1>
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto aspect-[1200/630] mb-6">
      <Image
        src={src}
        alt={alt}
        fill
        priority
        className="rounded-lg shadow-lg"
        onError={() => setError(true)}
      />
    </div>
  )
}