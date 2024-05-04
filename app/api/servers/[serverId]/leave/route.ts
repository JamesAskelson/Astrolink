import { currentProfile } from "@/lib/current-profle";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(res: NextRequest, {params}: {params: {serverId: string }}){
    try {
        const profile = await currentProfile()

        if(!profile){
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if(!params.serverId){
            return new NextResponse('no memberId from params', { status: 401 })
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: {
                    not:profile.id,
                },
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id
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
