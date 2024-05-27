import { currentProfile } from "@/lib/current-profle";
import { ProfileWithConverstations } from "@/type";
import { Profile } from "@prisma/client";
import { redirect } from "next/navigation";
import ConversationProfile from "./conversation-profile";

interface ConversationSidebarProps {
    profileInfo: ProfileWithConverstations
}



const ConversationsSidebar = async ({profileInfo}: ConversationSidebarProps) => {
    const profile = await currentProfile()

    if(!profile){
        return redirect('/')
    }

    const combinedConversations = [
        ...(profileInfo?.conversationInitiated || []),
        ...(profileInfo?.conversationReceived || []),
      ];

    return (
        <div className="flex flex-col h-full bg-zinc-400 dark:bg-zinc-800/70  w-full ">
            <div className="flex justify-center text-xl items-center dark:bg-zinc-800/70 p-auto h-11 border-b-2">
                Direct Messages
            </div>
            <div>
            {combinedConversations && (
                combinedConversations.map(conversation => (
                    <ConversationProfile conversation={conversation} profile={profile}/>
                ))
            )}
            </div>

        </div>
     );
}

export default ConversationsSidebar;
