import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/app/lib/auth';

const prisma = new PrismaClient();

async function detectClothes(imageUrl: string): Promise<boolean> {
    const visionApiUrl = 'https://vision.googleapis.com/v1/images:annotate';
    const visionApiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;

    const requestPayload = {
        requests: [
            {
                image: { source: { imageUri: imageUrl } },
                features: [{ type: 'OBJECT_LOCALIZATION' }],
            },
        ],
    };

    const response = await axios.post(`${visionApiUrl}?key=${visionApiKey}`, requestPayload);

    const objects = response.data.responses[0].localizedObjectAnnotations || [];
    const clothes = objects.filter((obj: any) =>
        ['Shirt', 'Pants', 'Dress', 'Clothing'].includes(obj.name)
    );

    return clothes.length > 0;
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { imageUrl } = await req.json();

    if (!imageUrl) {
        return NextResponse.json({ message: 'Image URL is required' }, { status: 400 });
    }

    try {
        const hasClothes = await detectClothes(imageUrl);

        if (!hasClothes) {
            return NextResponse.json({ message: 'No clothes detected in the image.' }, { status: 400 });
        }

        // Make a call to the GPT API to get fashion suggestions
        const suggestionResponse = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                model: 'text-davinci-003',
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
        const userEmail = session.user?.email as string;

        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Start a transaction
        await prisma.$transaction(async (tx) => {
            // Create a new suggestion
            await tx.suggestion.create({
                data: {
                    userId: user.id,
                    image : imageUrl,
                    text: suggestion,
                },
            });

            // Decrement user credits
            await tx.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    credits: {
                        decrement: 1,
                    },
                },
            });
        });

        return NextResponse.json({ suggestion });
    } catch (error) {
        console.error('Error getting fashion suggestion:', error);
        return NextResponse.json({ message: 'Error getting fashion suggestion' }, { status: 500 });
    }
}
