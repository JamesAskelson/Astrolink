import { currentProfile } from "@/lib/current-profle";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerChannelHeader from "./server-channel-header";

interface ServerChannelSidebarProps {
    serverId: string;
}

const ServerChannelSidebar = async ({ serverId }: ServerChannelSidebarProps) => {
    const profile = await currentProfile()
    if(!profile){
        return redirectToSignIn()
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createAt: 'asc',
                },
            },
            members: {
                include: {
                    profile: true
                }
            }
        }
    })

    if(!server || server == null){
        return redirect('/')
    }

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
    const voiceChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)

    const role = server.members.find((member) => member.profileId === profile.id)?.role

    return (
        <div className="flex flex-col h-full bg-zinc-400 w-full dark:bg-zinc-800">
            <ServerChannelHeader server={server} role={role}/>
        </div>
     );
}

export default ServerChannelSidebar;
