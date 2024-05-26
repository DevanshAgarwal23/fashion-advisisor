import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/app/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { imageUrl } = req.body as any;

    if (!imageUrl) {
        return NextResponse.json({ message: 'Image URL is required' }, { status: 400 });
    }

    try {
        // Make a call to the GPT API to get fashion suggestions
        const suggestionResponse = await axios.post(
            'https://api.openai.com/v1/engines/davinci-codex/completions',
            {
                prompt: `Provide fashion suggestions for the outfit in this image: ${imageUrl}`,
                max_tokens: 150,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        const suggestion = suggestionResponse.data.choices[0].text;

        // Get the user's email from the session
        const userEmail = session.user?.email;

        // Update user credits and save suggestion in the database
        // await prisma.suggestion.create({
        //     data: {
        //         userEmail : userEmail as string, 
        //         imageUrl,
        //         suggestion,
        //     },
        // });

        // Decrement user credits
        // await prisma.user.update({
        //     where: {
        //         email: userEmail, 
        //     },
        //     data: {
        //         credits: {
        //             decrement: 1,
        //         },
        //     },
        // });

        return NextResponse.json({ suggestion });
    } catch (error) {
        console.error('Error getting fashion suggestion:', error);
        return NextResponse.json({ message: 'Error getting fashion suggestion' }, { status: 500 });
    }
}
