import { currentProfile } from "@/lib/current-profle"
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server"
import { Message } from "@prisma/client";

const MessageBatch = 10;

export async function GET(
    req: NextRequest
) {
    try {
        const profile = await currentProfile()
        const {searchParams} = new URL(req.url);

        const cursor = searchParams.get('cursor')
        const channelId = searchParams.get('channelId')

        if(!profile){
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if(!channelId){
            return new NextResponse('Channel Id not found', { status: 400 })
        }

        let messages: Message[] = []

        if(cursor) {
            messages = await db.message.findMany({
                take: MessageBatch,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where: {
                    channelId: channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                },
                orderBy: {
                    createAt: 'desc'
                }
            })
        } else {
            messages = await db.message.findMany({
                take: MessageBatch,
                where: {
                    channelId: channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                },
                orderBy: {
                    createAt: 'desc'
                }
            })
        }

        let nextCursor = null;

        if(messages.length === MessageBatch){
            nextCursor = messages[MessageBatch - 1].id
        }

        return NextResponse.json({
            items: messages,
            nextCursor
        })

    } catch (error) {
        console.log("[MESSAGES_GET]", error)
        return new NextResponse('Interal Error', {status: 500 })
    }
}
