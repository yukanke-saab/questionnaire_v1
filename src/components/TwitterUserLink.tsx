'use client'

import Link from 'next/link'

interface TwitterUserLinkProps {
  twitterId: string
}

export default function TwitterUserLink({ twitterId }: TwitterUserLinkProps) {
  return (
    <Link
      href={`https://twitter.com/${twitterId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-gray-500 hover:text-blue-500"
    >
      @{twitterId}
    </Link>
  )
}