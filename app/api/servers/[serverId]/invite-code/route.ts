import {v4 as uuidv4} from 'uuid';
import { NextRequest, NextResponse } from 'next/server';
import { currentProfile } from '@/lib/current-profle';
import { db } from '@/lib/db';


export async function PATCH(req: NextRequest, { params }: { params: { serverId: string}}){
    try {
        console.log('im here')
        const profile = await currentProfile()

        if(!profile){
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!params.serverId) {
            return new NextResponse('No Server ID Found', { status: 401 })
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                inviteCode: uuidv4(),
            },
        });

        return NextResponse.json(server)
        
    } catch (error) {
        console.log('[SERVERS_POST]', error)
        return new NextResponse('Interal Error', {status: 500 })
    }
}
