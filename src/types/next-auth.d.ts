import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      twitter_id?: string
    } & DefaultSession['user']
  }

  interface User {
    twitter_id?: string
  }
}