import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/service/prisma";

export const secret = process.env.NEXTAUTH_SECRET;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // 使用 CredentialsProvider 时，必须使用 JWT 策略
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/account/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        console.log("user", user);

        if (!user || !user.hashedPassword) {
          return null;
        }

        const isValid = await compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.fullName ?? undefined,
          image: user.avatarUrl ?? undefined,
        };
      },
    }),
    // TODO: 如需 OAuth（GitHub/Google 等），可在此处追加 Provider，并在 .env 中配置对应密钥
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        // token.sub 为用户 id（Credentials 登录时）
        if (token.sub) {
          (session.user as any).id = token.sub;
        }
        if (token.name) {
          session.user.name = token.name;
        }
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
  },
  secret,
  events: {},
};
