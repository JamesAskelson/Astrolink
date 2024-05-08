import {v4 as uuidv4} from 'uuid';
import { NextRequest, NextResponse } from 'next/server';
import { currentProfile } from '@/lib/current-profle';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { channel } from 'diagnostics_channel';
import { revalidatePath } from 'next/cache';

export async function DELETE(res: NextRequest, { params }: { params: { serverId: string, channelId: string }}){
    try {
        const profile = await currentProfile()

        if(!profile){
            return new NextResponse('Unauthorized', { status: 401})
        }

        if(!params.serverId) {
            return new NextResponse('No Server ID Found', { status: 401 })
        }

        if(!params.channelId) {
            return new NextResponse('No Channel ID Found', { status: 401 })
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
            },
            data: {
                channels: {
                    delete: {
                        id: params.channelId
                    }
                }
            }
        })

        const response = NextResponse.json(server)
        response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        return response
    } catch (error){
        console.log('[SERVERS_POST]', error)
        return new NextResponse('Interal Error', {status: 500 })
    }

}

export async function PATCH(res: NextRequest, { params }: { params: { serverId: string, channelId: string }}){
    try {
        const profile = await currentProfile()
        const { name, type } = await res.json()
        if(!profile){
            return new NextResponse('Unauthorized', { status: 401})
        }

        if(!params.serverId) {
            return new NextResponse('No Server ID Found', { status: 401 })
        }

        if(!params.channelId) {
            return new NextResponse('No Channel ID Found', { status: 401 })
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: params.channelId,
                        },
                        data: {
                            name,
                            type,
                        }
                    }
                }
            }
        })
        return NextResponse.json(server)

    } catch (error){
        console.log('[SERVERS_POST]', error)
        return new NextResponse('Interal Error', {status: 500 })
    }

}
