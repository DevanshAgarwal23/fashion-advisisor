import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { NextAuthOptions} from 'next-auth';


const prisma = new PrismaClient();
export const authOptions : NextAuthOptions = {
    adapter: PrismaAdapter(prisma),  
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
    ],
    pages: {
      signIn: '/auth/signin',
      signOut: '/auth/signout',
    },
    theme: {
      colorScheme: 'auto',
      brandColor: '#51233A',
      logo: '/vercel.svg',
    },
    // session:{
    //   strategy: 'jwt'
    // },
    // callbacks: {
    //   async session({ session , user }) {
    //     console.log(user)  
    //     session.user = user; 
    //     return session;
    //   },
    // },
  };