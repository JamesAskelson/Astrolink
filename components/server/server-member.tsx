'use client'

import { cn } from "@/lib/utils";
import { ChannelType, Member, MemberRole, Profile, Server } from "@prisma/client";
import { Delete, Edit, Hash, Lock, Mic, ShieldAlert, ShieldX, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../ui/action-tooltip";
import UserAvatar from "../profile/user-profile";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
interface ServerChannelProps {
    member: Member & { profile: Profile };
    server: Server;
    role?: MemberRole;
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldX />,
    [MemberRole.ADMIN]: <ShieldAlert />
}


const ServerMember = ({ member, server, role }: ServerChannelProps) => {
    const params = useParams();
    const router = useRouter();

    const Icon = roleIconMap[member.role]

    const onClick = () => {

         return router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
    }
    return (
            <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none" asChild>
                    <div className="ml-8 mb-4 flex items-center gap-x-2 hover:cursor-pointer">
                        <UserAvatar src={member?.profile?.imageUrl}/>
                        <div className="flex items-center gap-2 text-slate-400">
                            {member?.profile?.userName}
                            {Icon}
                        </div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <div onClick={() => onClick()} className="hover:cursor-pointer">
                            Message
                        </div>
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

     );
}

export default ServerMember;
