import ChannelHeader from "@/components/channel/channel-header";
import { ChatInput } from "@/components/chat/chat-input";
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


const ChannelIdPage = async ({ params }: ServerIdPageProps) => {
    const profile = await currentProfile()

    if(!profile) {
        return redirectToSignIn()
    }

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId
        }
    })

    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id
        }
    })

    if(!channel || !member){
        redirect('/')
    }


    return (
        <div className="flex flex-col h-full">
            <ChannelHeader serverId={channel.serverId} name={channel.name} />
            <div className="flex-1">
                Future References
            </div>
            <ChatInput name={channel.name} query={{serverId: params.serverId, channelId: params.channelId}} type='channel' apiUrl='/api/socket/'/>
        </div>
    )
}

export default ChannelIdPage;
