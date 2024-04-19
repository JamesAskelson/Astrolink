import {v4 as uuidv4} from 'uuid';
import { NextRequest, NextResponse } from 'next/server';
import { currentProfile } from '@/lib/current-profle';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';

export async function POST(res: NextRequest){
    try {
        const {name, imageUrl} = await res.json()
        const profile = await currentProfile()

        if(!profile){
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name,
                imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        { name: 'general', profileId: profile.id}
                    ]
                },
                members: {
                    create: [
                        { profileId: profile.id, role: MemberRole.ADMIN}
                    ]
                }
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log('[SERVERS_POST]', error)
        return new NextResponse('Interal Error', {status: 500 })
    }
}
