import ConversationsSidebar from "@/components/conversations/profile-conversations-sidebar";
import ServerChannelSidebar from "@/components/server/server-channel-sidebar";
import ServerMembersSidebar from "@/components/server/server-members-sidebar";
import { currentProfile } from "@/lib/current-profle";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { Router } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useState } from "react";

const ConversationIdLayout  = async ({children, params} : {
    children: React.ReactNode;
    params: {conversationId: string};
}) => {
    const profile = await currentProfile()

    if(!profile) {
        return redirectToSignIn()
    }

    const profileInfo = await db.profile.findFirst({
        where: {
            id: profile.id
        },
        include: {
            conversationInitiated: true,
            conversationReceived: true
        }
    })

    if (!profileInfo) {
        return redirect('/'); // Handle the case where profileInfo is null
      }

    const conversation = await db.conversation.findFirst({
        where: {
            OR: [
              { profileOneId: profile.id, profileTwoId: params.conversationId },
              { profileOneId: params.conversationId, profileTwoId: profile.id },
            ],
          },
    })

    if(!conversation){
        return redirect('/')
    }

    return (
        <div className='h-full flex'>
            <div className='hidden md:flex h-full w-60 z-20 fixed inset-y-0'>
                <ConversationsSidebar profileInfo={profileInfo}/>
            </div>
            <main className='md:pl-60 w-full h-full flex-grow'>
                {children}
            </main>
        </div>
     );
}

export default ConversationIdLayout;
