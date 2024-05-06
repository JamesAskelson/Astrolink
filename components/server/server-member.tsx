'use client'

import { cn } from "@/lib/utils";
import { ChannelType, Member, MemberRole, Profile, Server } from "@prisma/client";
import { Delete, Edit, Hash, Lock, Mic, ShieldAlert, ShieldX, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../ui/action-tooltip";
import UserAvatar from "../profile/user-profile";
interface ServerChannelProps {
    member: Member & { profile: Profile };
    server: Server;
    role?: MemberRole;
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldAlert />,
    [MemberRole.ADMIN]: <ShieldX />
}


const ServerMember = ({ member, server, role }: ServerChannelProps) => {
    const params = useParams();
    const router = useRouter();

    const Icon = roleIconMap[member.role]

    const onClick = ({id, type}: {id: string, type: 'channel' | 'member'}) => {

        if(type === 'member'){
            return router.push(`/servers/${params?.serverId}/conversations${id}`)
        }

        if(type === 'channel'){
            return router.push(`/servers/${params?.serverId}/channels/${id}`)
        }
  }
    console.log(member)
    return (
                <button className="ml-8 mb-4 flex items-center gap-x-2">
                    <UserAvatar src={member?.profile?.imageUrl}/>
                    <div className="flex items-center gap-2 text-slate-400">
                        {member?.profile?.userName}
                        {Icon}
                    </div>

                </button>
     );
}

export default ServerMember;
