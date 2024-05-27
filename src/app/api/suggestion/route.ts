import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/app/lib/auth';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI();
async function detectClothes(imageUrl: string): Promise<boolean> {
    console.log("imageUrl", imageUrl)
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
    console.log("requestPayload", requestPayload)
    const response = await axios.post(`${visionApiUrl}?key=${visionApiKey}`, requestPayload);
    console.log("Computer vision res:" , response)
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
        // const hasClothes = await detectClothes(imageUrl);

        // if (!hasClothes) {
        //     return NextResponse.json({ message: 'No clothes detected in the image.' }, { status: 400 });
        // }

        // Make a call to the GPT API to get fashion suggestions

        const response = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            messages: [
              {
                role: "user",
                content: [
                    {
                        "type": "text",
                        "text": "Provide fashion advice based on the given outfit. Consider factors like color coordination, style, and accessories. Please provide specific suggestions rather than general comments or invitations for feedback. For example, suggest alternative clothing items, styling tips, or outfit combinations. In not more than 500 words"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": imageUrl
                        }
                    }
                ],
              },
            ],
            "max_tokens": 400,
            "temperature": 0.9
          });
      
        console.log(response.choices[0].message)

         const suggestion = response.choices[0].message.content;
          console.log(suggestion)

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
                    text: suggestion as string,
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
