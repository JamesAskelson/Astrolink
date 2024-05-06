'use client'

import { ServerWithMembersWithProfiles } from "@/type";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "../ui/action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/app/hooks/user-modal-store";

interface ServerSectionProps {
    sectionType: string;
    channelType?: ChannelType;
    role?: MemberRole;
    label: string;
    server?: ServerWithMembersWithProfiles
}


const ServerSection = ({ sectionType, channelType, role, label, server}: ServerSectionProps) => {
    const { onOpen } = useModal()

    return (
        <div className="flex justify-between items-center pt-4">
            <p className='text-sm uppercase font-semibold text-zinc-500 dark:text-zinc-400'>
                {label}
            </p>
            {role !== MemberRole.GUEST && sectionType === 'channels' && (
                <ActionTooltip label='Create Channel' side='top'>
                    <button onClick={() => onOpen('createChannel', { channelType })} className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300'>
                        <Plus className='w-5 h-5'/>
                    </button>
                </ActionTooltip>
            )}
            {role === MemberRole.ADMIN && sectionType === 'members' && (
                <ActionTooltip label='Manage Members' side='top'>
                    <button onClick={() => onOpen('manageMembers', { server })} className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300'>
                        <Settings className='w-5 h-5'/>
                    </button>
                </ActionTooltip>
            )}
        </div>
     );
}

export default ServerSection;
