import { NextApiRequest } from 'next';
import { db } from '@/lib/db';
import { NextApiResponseServerIo } from '@/type';
import { currentProfilePages } from '@/lib/current-profle-pages';

export default async function POST(req: NextApiRequest, res: NextApiResponseServerIo){
    try {
        const profile = await currentProfilePages(req)
        const { content, fileUrl } = await req.body
        const { serverId, channelId } = await req.query


        console.log('profiletimeeeeeeeeeeeeeeeeeeeeeee', profile)

        if(!profile){
            return res.status(405).json({message: "Not Authorized"})
        }

        if(!content){
            return res.status(400).json({message: "Content Missing"})
        }

        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
            },
            include: {
                members: true,
            }
        })

        if(!server){
            return res.status(400).json({message: "Server doesn't Exist"})
        }

        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string
            }
        })

        if(!channel){
            return res.status(400).json({message: "Channel doesn't Exist"})
        }

        const member = server.members.find((member) => member.profileId == profile.id)

        if(!member){
            return res.status(400).json({message: "Member doesn't Exist"})
        }

        const message = await db.message.create({
            data: {
                text: content,
                fileUrl,
                channelId: channelId as string,
                memberId: member.id,
                serverId: serverId as string,
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })

        const channelKey = `chat:${channelId}:messages`

        res?.socket?.server?.io?.emit(channelKey, message)

        return res.status(200).json(message)

    } catch (error){
        console.log('[Message_Post]', error)
        return res.status(500).json({message: 'Internal Error'})
    }
}
