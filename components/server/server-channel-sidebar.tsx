import { currentProfile } from "@/lib/current-profle";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerChannelHeader from "./server-channel-header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Video, Hash, Mic, ShieldAlert, ShieldX } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
interface ServerChannelSidebarProps {
    serverId: string;
}

const iconMap = {
    [ChannelType.TEXT]: <Hash />,
    [ChannelType.AUDIO]: <Mic />,
    [ChannelType.VIDEO]: <Video />
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldAlert />,
    [MemberRole.ADMIN]: <ShieldX />
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

    const members = server?.members.filter((member) => member.profileId !== profile.id)

    const role = server.members.find((member) => member.profileId === profile.id)?.role

    return (
        <div className="flex flex-col h-full bg-zinc-400 w-full dark:bg-zinc-800">
            <ServerChannelHeader server={server} role={role}/>
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch data={
                        [
                            {
                                label: 'Text Channel',
                                type: 'channel',
                                data: textChannels?.map(channel => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                }))
                            },
                            {
                                label: 'Audio Channel',
                                type: 'channel',
                                data: voiceChannels?.map(channel => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                }))
                            },
                            {
                                label: 'Video Channel',
                                type: 'channel',
                                data: videoChannels?.map(channel => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                }))
                            },
                            {
                                label: 'Members',
                                type: 'member',
                                data: members?.map(member => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role],
                                }))
                            },
                        ]
                    }/>
                </div>
                <Separator className="h-[2px] my-2 bg-zinc-400  dark:bg-zinc-600  w-4/5 mx-auto" />
                {!!textChannels?.length && (
                    <div className='mb-2'>
                        <ServerSection
                            sectionType='channels'
                            channelType={ChannelType.TEXT}
                            role={role}
                            label='Text Channels'
                            server={server}
                        />
                        {textChannels.map((channel) => (
                            <ServerChannel
                            key={channel.id}
                            channel={channel}
                            role={role}
                            server={server}
                            />
                        ))}
                    </div>
                )}
                {!!voiceChannels?.length && (
                    <div className='mb-2'>
                        <ServerSection
                            sectionType='channels'
                            channelType={ChannelType.AUDIO}
                            role={role}
                            label='Voice Channels'
                            server={server}
                        />
                        {voiceChannels.map((channel) => (
                            <ServerChannel
                            key={channel.id}
                            channel={channel}
                            role={role}
                            server={server}
                            />
                        ))}
                    </div>
                )}
                {!!videoChannels?.length && (
                    <div className='mb-2'>
                        <ServerSection
                            sectionType='channels'
                            channelType={ChannelType.VIDEO}
                            role={role}
                            label='Video Channels'
                            server={server}
                        />
                        {videoChannels.map((channel) => (
                            <ServerChannel
                            key={channel.id}
                            channel={channel}
                            role={role}
                            server={server}
                            />
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
     );
}

export default ServerChannelSidebar;
