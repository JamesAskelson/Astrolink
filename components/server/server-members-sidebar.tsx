import { currentProfile } from "@/lib/current-profle";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ServerMembersSidebarProps {
    serverId: string;
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

    const members = server?.members.filter((member) => member.profileId !== profile.id)
    const role = server.members.find((member) => member.profileId === profile.id)?.role


    return (
        <div className='h-full'>
            members
        </div>
     );
}

export default ServerMembersSidebar;
