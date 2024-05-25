import { getOrCreateConversation } from "@/app/api/conversations/route"
import { currentProfile } from "@/lib/current-profle"
import { db } from "@/lib/db"
import { redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"

interface ConversationPageProps {
    params: {
        serverId: string,
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
            serverId: params.serverId,
            profileId: profile.id
        },
        include: {
            profile: true
        }
    })

    if(!currMember){
        return redirect('/')
    }

    const convesation = await getOrCreateConversation(currMember.id, params.conversationId)

    if(!convesation){
        return redirect(`/servers/${params.serverId}`)
    }

    return (
        <div>
            Member Id Page
        </div>
    )
}

export default ConversationIdPage
