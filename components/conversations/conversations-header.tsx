import { Channel } from "@prisma/client";
import { Hash,} from "lucide-react";
import MobileServerMenu from "../menu/mobile-server-menu";
import MobileMembersMenu from "../menu/mobile-members-menu";
import UserAvatar from "../profile/user-profile";
import { Avatar, AvatarImage } from "../ui/avatar";
import { SocketIndicator } from "./socket-indicator";

interface ConversationHeaderProps {
    name: string;
    imageUrl?: string;
}



const ConversationsHeader = ({name, imageUrl}: ConversationHeaderProps) => {


    return (
        <div className="flex justify-between text-md items-center p-2 dark:bg-zinc-800/70 p-auto h-11 border-b-2 w-full">
            <div className="pl-2 flex gap-2 items-center">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={imageUrl} />
                </Avatar>
                <p className="dark:text-slate-300">
                    {name}
                </p>
            </div>
            <div>
                <SocketIndicator />
            </div>
        </div>
     );
}

export default ConversationsHeader;
