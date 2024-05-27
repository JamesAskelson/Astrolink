import { db } from "@/lib/db";
import { Conversation, Profile } from "@prisma/client";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import UserAvatar from "../profile/user-profile";

interface ConversationProfileProps {
    conversation: Conversation,
    profile: Profile
}


const ConversationProfile = async ({conversation, profile}: ConversationProfileProps) => {
    let otherProfileId = profile.id === conversation.profileOneId ? conversation.profileTwoId : conversation.profileOneId

    let otherProfile = await db.profile.findFirst({
        where: {
            id: otherProfileId
        }
    })


    return (
            <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none" asChild>
                    <div className="ml-8 mb-4 flex items-center gap-x-2 hover:cursor-pointer pt-4">
                        <UserAvatar src={otherProfile?.imageUrl}/>
                        <div className="flex items-center gap-2 text-slate-400">
                            {otherProfile?.userName}
                        </div>
                    </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <div>
                            Message
                        </div>
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
     );
}

export default ConversationProfile;
