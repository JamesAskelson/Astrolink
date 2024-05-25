import { currentProfile } from "@/lib/current-profle";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { MemberRole } from "@prisma/client";
import { Settings, ShieldAlert, ShieldX } from "lucide-react";
import { redirect } from "next/navigation";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";
import { ActionTooltip } from "../ui/action-tooltip";
import ServerSectionMembers from "./server-section-members";
import { Separator } from "../ui/separator";
import { ManageMembersModal } from "../modals/manager-members-modal";

interface ServerMembersSidebarProps {
    serverId: string;
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldAlert />,
    [MemberRole.ADMIN]: <ShieldX />
}

const ServerMembersSidebar = async ({ serverId }: ServerMembersSidebarProps) => {
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

    if(!server){
        return redirect('/')
    }

    const members = server?.members
    const currId = server?.members?.find((member) => member.profileId === profile.id)
    const role = server.members.find((member) => member.profileId === profile.id)?.role


    return (
        <div className="flex flex-col h-full bg-zinc-400 w-full dark:bg-zinc-800">
            <ServerSectionMembers
                sectionType='members'
                role={role}
                label='Members'
                server={server}
            />
            <Separator className="h-[2px] my-2 bg-zinc-400  dark:bg-zinc-600  w-4/5 mx-auto" />
            {!!members?.length && (
                    <div className='mb-2'>
                        {members.map((member) => (
                            <ServerMember
                            key={member.id}
                            member={member}
                            role={role}
                            server={server}
                            profId={currId?.id}
                            />
                        ))}
                    </div>
                )}
        </div>
     );
}

export default ServerMembersSidebar;
