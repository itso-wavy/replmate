import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';
import NaverProvider from 'next-auth/providers/naver';

import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { UserDto } from '@/types';

// import EmailProvider from "next-auth/providers/email"  // 향후 추가

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
    // ...add more providers here
  ],

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
    // error: '/auth/error',
  },

  callbacks: {
    async signIn({ account, profile }) {
      if (!account) return false;

      try {
        const endpointMap: Record<string, string> = {
          google: ENDPOINTS.OAUTH.GOOGLE,
          kakao: ENDPOINTS.OAUTH.KAKAO,
          naver: ENDPOINTS.OAUTH.NAVER,
        };

        const endpoint = endpointMap[account.provider];
        if (!endpoint) {
          console.error('Unsupported provider:', account.provider);
          return false;
        }

        // 백엔드로 OAuth access token 전달하여 JWT 교환 (axios 사용)
        const response = await api.post(endpoint, {
          accessToken: account.access_token,
          // FIXME: 스키마 변경되어야 할 부분
          // profile: {
          //   id: profile?.sub || account.userId, // OAuth provider ID
          //   email: profile?.email,
          //   name: profile?.name,
          // },
        });

        const { accessToken, refreshToken, user } = response.data;

        account.backendAccessToken = accessToken;
        account.backendRefreshToken = refreshToken;
        account.backendUser = user;

        return true;
      } catch (error) {
        console.error('SignIn callback error:', error);
        return false;
      }
    },

    async jwt({ token, account }) {
      // 최초 로그인 시 백엔드 JWT를 token에 저장
      if (account?.backendAccessToken) {
        token.backendAccessToken = account.backendAccessToken;
        token.backendRefreshToken = account.backendRefreshToken;
        token.backendUser = account.backendUser;
      }

      return token;
    },

    async session({ session, token }) {
      // 클라이언트로 전달할 세션 데이터
      session.backendAuth = {
        accessToken: token.backendAccessToken as string,
        refreshToken: token.backendRefreshToken as string,
        // sessionId: token.backendSessionId as string,
      };
      session.user = token.backendUser as UserDto;

      return session;
    },
  },
};

export default NextAuth(authOptions);
