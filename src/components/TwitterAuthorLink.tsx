'use client'

interface TwitterAuthorLinkProps {
  name: string | null
  twitterId: string | null
  className?: string
}

export default function TwitterAuthorLink({ name, twitterId, className }: TwitterAuthorLinkProps) {
  if (!twitterId) {
    return <span className={className}>{name}</span>
  }

  const handleTwitterClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(`https://twitter.com/${twitterId}`, '_blank')
  }

  return (
    <button
      onClick={handleTwitterClick}
      className={className}
    >
      {name}
    </button>
  )
}