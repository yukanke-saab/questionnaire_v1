import type { NextAuthOptions } from 'next-auth'
import TwitterProvider from "next-auth/providers/twitter"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
      profile(profile) {
        return {
          id: profile.data.id,
          name: profile.data.name,
          email: profile.email,
          image: profile.data.profile_image_url?.replace('_normal', ''),
          twitter_id: profile.data.username
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.twitter_id = (user as any).twitter_id;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "twitter") {
        try {
          const twitterProfile = profile as any;
          await prisma.user.update({
            where: { id: user.id },
            data: {
              twitter_id: twitterProfile.data.username
            }
          });
        } catch (error) {
          console.error("Error updating twitter_id:", error);
        }
      }
      return true;
    }
  }
}