import NextAuth, { type NextAuthOptions, type User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { AUTH_PROVIDER_ID } from '@/constants/auth';
import { ROUTES } from '@/constants/nav-menu';
import { UserDto } from '@/types/api/user';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: AUTH_PROVIDER_ID.BACKEND_SESSION,
      credentials: {
        user: { type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.user) return null;
        try {
          return JSON.parse(credentials.user) as User;
        } catch {
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: ROUTES.LOGIN,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as unknown as UserDto;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user as UserDto;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
