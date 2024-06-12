import ChannelHeader from "@/components/channel/channel-header";
import { ChatInput } from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
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
                <ChatMessages
                member={member}
                name={channel.name}
                chatId={channel.id}
                type="channel"
                apiUrl='/api/messages'
                socketUrl="/api/socket/messages"
                socketQuery={{
                    serverId: params.serverId, channelId: params.channelId
                }}
                paramKey="channelId"
                paramValue={channel.id}
                />
            <ChatInput name={channel.name} query={{serverId: params.serverId, channelId: params.channelId}} type='channel' apiUrl='/api/socket/messages'/>
        </div>
    )
}

export default ChannelIdPage;
