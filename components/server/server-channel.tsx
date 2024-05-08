'use client'

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Delete, Edit, Hash, Lock, Mic, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../ui/action-tooltip";
import { useModal } from "@/app/hooks/user-modal-store";

interface ServerChannelProps {
    channel: Channel;
    server: Server;
    role?: MemberRole;
    id: string;
}

const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video,
}

const ServerChannel = ({ id, channel, server, role }: ServerChannelProps) => {
    const { onOpen } = useModal();
    const params = useParams();
    const router = useRouter();
    const Icon = iconMap[channel.type]

    const onClick = ({id}: {id: string}) => {

        return router.push(`/servers/${params?.serverId}/channels/${id}`)

    }

    return (
                <div  className={cn('group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hoverbg-zinc-700/50 transition mb-1', params?.channelId === channel.id && 'bg-zinc-700/20 dark: bg-zinc-700')}
                >
                    <Icon className='flex-shrink-0 w-5 h-5 text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300'/>
                    <p onClick={() => onClick({id})} className="text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300">
                        {channel.name}
                    </p>
                    {channel.name !== 'general' && role !== MemberRole.GUEST && (
                        <div className='ml-auto flex items-center gap-x-2'>
                            <ActionTooltip label='Edit'>
                                <Edit onClick={() => onOpen('editChannel', { server, channel })} className="text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 w-4 h-4"/>
                            </ActionTooltip>
                            <ActionTooltip label='Delete'>
                                <Delete onClick={() => onOpen('deleteChannel', { server, channel })} className="text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 w-4 h-4"/>
                            </ActionTooltip>
                        </div>
                    )}
                    {channel.name === 'general' && (
                        <div  className='ml-auto flex items-center gap-x-2'>
                            <Lock className="text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 w-4 h-4"/>
                        </div>
                    )}
                </div>
     );
}

export default ServerChannel;
