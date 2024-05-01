import { NextRequest, NextResponse } from 'next/server';
import { currentProfile } from '@/lib/current-profle';
import { db } from '@/lib/db';

export async function DELETE(req: NextRequest, { params }: { params: { memberId: string }}){
    try {

        const profile = await currentProfile()
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');

        if(!profile){
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if(!serverId){
            return new NextResponse('no serverId', { status: 401 })
        }

        if(!params.memberId){
            return new NextResponse('no memberId from params', { status: 401 })
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                members: {
                    delete: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: 'asc'
                    }
                }
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log('[SERVERS_POST]', error)
        return new NextResponse('Interal Error', {status: 500 })
    }
}


export async function PATCH(req: NextRequest, { params }: { params: { memberId: string }}){
    try {

        const profile = await currentProfile()
        const { searchParams } = new URL(req.url);
        const { role } = await req.json()

        const serverId = searchParams.get('serverId');

        if(!profile){
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if(!serverId){
            return new NextResponse('no serverId', { status: 401 })
        }

        if(!params.memberId){
            return new NextResponse('no memberId from params', { status: 401 })
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: 'asc'
                    }
                }
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log('[SERVERS_POST]', error)
        return new NextResponse('Interal Error', {status: 500 })
    }
}
