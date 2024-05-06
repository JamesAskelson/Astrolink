'use client'

import { ServerWithMembersWithProfiles } from "@/type";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "../ui/action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/app/hooks/user-modal-store";
import UserAvatar from "../profile/user-profile";

interface ServerSectionProps {
    sectionType: string;
    role?: MemberRole;
    label: string;
    server?: ServerWithMembersWithProfiles
}

const ServerSectionMembers = ({ sectionType, role, label, server}: ServerSectionProps) => {
    const { onOpen } = useModal()

    return (
        <div className="mx-auto w-4/5 flex mt-4 justify-center gap-4 text-xl text-zinc-500 dark:text-zinc-300 border-4 border-zinc-500 rounded-lg bg-zinc-500">
                Members
                <ActionTooltip label='Manage Members' side='top'>
                    <button onClick={() => onOpen('manageMembers', { server })} className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-300 dark:hover:text-zinc-200'>
                        <Settings className='w-5 h-5'/>
                    </button>
                </ActionTooltip>
        </div>
     );
}

export default ServerSectionMembers;
