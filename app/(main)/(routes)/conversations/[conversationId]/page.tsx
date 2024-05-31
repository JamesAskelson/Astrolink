import { getOrCreateConversation } from "@/app/api/conversations/route"
import ChannelHeader from "@/components/channel/channel-header"
import ConversationsHeader from "@/components/conversations/conversations-header"
import { currentProfile } from "@/lib/current-profle"
import { db } from "@/lib/db"
import { redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"

interface ConversationPageProps {
    params: {
        conversationId: string
    }
}


const ConversationIdPage = async ({params}: ConversationPageProps) => {
    const profile = await currentProfile()

    if(!profile){
        return redirectToSignIn()
    }

    const currMember = await db.member.findFirst({
        where: {
            profileId: profile.id
        },
        include: {
            profile: true
        }
    })

    if(!currMember){
        return redirect('/')
    }

    const convesation = await getOrCreateConversation(currMember.profile.id, params.conversationId)

    if(!convesation){
        return redirect(`/`)
    }

    const { profileOne, profileTwo} = convesation;

    const otherMember = profileOne.id === profile.id ? profileTwo : profileOne

    return (
        <div className="h-full flex flex-col">
            <ConversationsHeader name={otherMember.name} imageUrl={otherMember.imageUrl} />
            <div className="flex-1">
                Future Messages
            </div>
            <div>
                input
            </div>
        </div>
    )
}

export default ConversationIdPage
