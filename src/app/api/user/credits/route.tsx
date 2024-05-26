import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';


const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user?.email;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: userEmail as string,
            },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ credits: user.credits });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error fetching credits' }, { status: 500 });
    }
}
