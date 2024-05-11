import { currentProfile } from "@/lib/current-profle";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
    params: {
        serverId: string,
        channelId: string
    }
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {

    const profile = await currentProfile()

    if(!profile) {
        return redirectToSignIn()
    }

    const server = await db.server.findUnique({
        where: {
            id: params.serverId
        },
        include: {
            channels: true
        }
    })

    const initialChannel = server?.channels[0]

    return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`)
}

export default ServerIdPage;
