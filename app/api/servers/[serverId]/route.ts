import {v4 as uuidv4} from 'uuid';
import { NextRequest, NextResponse } from 'next/server';
import { currentProfile } from '@/lib/current-profle';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function DELETE(req: NextRequest, { params }: { params: { serverId: string}}){
    try {
        const profile = await currentProfile()

        if(!profile){
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const server = await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
        })

        const response = NextResponse.json(server);
        response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.log('[SERVERS_DELETE]', error)
        return new NextResponse('Interal Error', {status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { serverId: string}}){
    try {
        const {name, imageUrl} = await req.json()
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
                name,
                imageUrl
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log('[SERVERS_POST]', error)
        return new NextResponse('Interal Error', {status: 500 })
    }
}
