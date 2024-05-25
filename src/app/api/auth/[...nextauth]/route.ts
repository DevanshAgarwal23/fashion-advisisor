// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const authOptions : NextAuthOptions = {
  adapter: PrismaAdapter(prisma),  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session:{
    strategy: 'jwt'
  },
  callbacks: {
    async session({ session , user }) {
      console.log(user)  
      session.user = user; 
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };