import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/app/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Fetch user suggestions from the database
        const user = await prisma.user.findUnique({
            where: {
                email: session.user?.email as string,
            },
            include: {
                suggestions: true,
            },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        console.log(user)

        const suggestions = user.suggestions.map(suggestion => suggestion.text);
        return NextResponse.json({ suggestions });
    } catch (error) {
        console.error('Error fetching user suggestions:', error);
        return NextResponse.json({ message: 'Error fetching user suggestions' }, { status: 500 });
    }
}
