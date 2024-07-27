import { Member, MemberRole, Profile } from "@prisma/client";
import UserAvatar from "../profile/user-profile";
import { ShieldAlert, ShieldX } from "lucide-react";
import { ActionTooltip } from "../ui/action-tooltip";
import { isAppPageRouteDefinition } from "next/dist/server/future/route-definitions/app-page-route-definition";
import Image from "next/image";

interface ChatItemProps {
    id: string;
    text: string | null;
    member: Member & {
        profile: Profile
    }
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>
}


const roleIconMap = {
    'GUEST': null,
    'MODERATOR': <ShieldAlert className="h-4 w-4"/>,
    'ADMIN': <ShieldX className="h-4 w-4 text-red-800"/>
}

const ChatItem = ({id, text, member, timestamp, fileUrl, deleted, currentMember, isUpdated, socketQuery, socketUrl}: ChatItemProps) => {
    const fileType = fileUrl?.split(".").pop()


    const isAdmin = currentMember.role == MemberRole.ADMIN;
    const isModerator = currentMember.role == MemberRole.MODERATOR;
    const isOwner = currentMember.id === member.id
    const canDelete = !deleted && (isAdmin || isModerator || isOwner)
    const canEdit = !deleted && isOwner
    const isPDF = fileType === 'pdf' && fileUrl
    const isImage = fileUrl && !isPDF;

    return (
        <div className="flex py-2 gap-4">
            <div className="cursor-pointer">
                <UserAvatar src={member.profile.imageUrl} />
            </div>
            <div>
                <div className="flex gap-2 items-center">
                    <div className="text-slate-300 flex items-center">
                        {member.profile.name}
                        <ActionTooltip label="role">
                            {roleIconMap[member.role]}
                        </ActionTooltip>
                    </div>
                    <div className="text-xs text-slate-400">
                        {timestamp}
                    </div>
                </div>
                <div className="flex flex-col">
                    <div>
                        {text}
                    </div>
                    <div>
                        {isImage &&
                        <a
                            href={fileUrl}
                            className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                        >
                            <Image
                                src={fileUrl}
                                alt={fileUrl}
                                fill
                            />
                        </a>
                        }
                    </div>
                </div>
            </div>
        </div>
     );
}

export default ChatItem;
