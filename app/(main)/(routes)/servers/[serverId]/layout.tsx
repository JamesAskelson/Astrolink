import ServerChannelSidebar from "@/components/server/server-channel-sidebar";
import ServerMembersSidebar from "@/components/server/server-members-sidebar";
import { currentProfile } from "@/lib/current-profle";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { Router } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useState } from "react";

const ServerIdLayout  = async ({children, params} : {
    children: React.ReactNode;
    params: {serverId: string};
}) => {
    const profile = await currentProfile()

    if(!profile) {
        return redirectToSignIn()
    }

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if(!server || server == null){
        return redirect('/')
    }


    return (
        <div className='h-full'>
            <div className='hidden md:flex h-full w-60 z-20 fixed inset-y-0'>
                <ServerChannelSidebar serverId={server.id}/>
            </div>
            <main className='md:pl-60 h-full fixed top-0'>
                {children}
            </main>
            <div className='hidden md:flex h-full w-60 z-20 fixed right-0 top-0'>
                <ServerMembersSidebar serverId={server.id}/>
            </div>
        </div>
     );
}

export default ServerIdLayout;
