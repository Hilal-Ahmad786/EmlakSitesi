import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  // adapter: PrismaAdapter(prisma) as any, // Disabled for dummy mode
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        // MOCK AUTHENTICATION
        // Accept any email/password for demo purposes, or specific one
        // Simulating delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const isAdmin = String(credentials.email).includes('admin');

        if (isAdmin) {
          return {
            id: 'dummy-admin-id',
            email: String(credentials.email),
            name: 'Dummy Admin',
            role: 'SUPER_ADMIN',
          };
        }

        // Default dummy user
        return {
          id: 'dummy-user-id',
          email: String(credentials.email),
          name: 'Dummy User',
          role: 'USER',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // @ts-ignore
        session.user.role = token.role as string || 'USER'; // Fallback
      }
      return session;
    },
  },
});
