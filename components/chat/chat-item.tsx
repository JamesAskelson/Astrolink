import { Member, MemberRole, Profile } from "@prisma/client";
import UserAvatar from "../profile/user-profile";
import { Edit, FileIcon, ShieldAlert, ShieldX } from "lucide-react";
import { ActionTooltip } from "../ui/action-tooltip";
import { isAppPageRouteDefinition } from "next/dist/server/future/route-definitions/app-page-route-definition";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false)


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
                    {canDelete && (
                    <div className="group-hover:flex items-center gap-x-2 group-hover:bg-white dark:bg-zinc-800 border rounded-sm">
                        {canEdit && (
                            <ActionTooltip label='Edit'>
                                <Edit
                                onClick={() => setEditing(true)}
                                className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'/>
                            </ActionTooltip>
                        )}
                    </div>
                )}
                </div>
                <div className="flex flex-col">
                    {!fileUrl && !editing && (
                            <p className={cn(
                                "text-sm text-zinc-600 dark:text-zinc-300", deleted && 'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1'
                            )}>
                                {text}
                                {isUpdated && !deleted && (
                                    <span className='text-[10px] mx-2 text-zinc-500 dark:text-zinc-400'>
                                        (edited)
                                    </span>
                                )}
                            </p>
                        )}
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
                                className='object-cover'
                            />
                        </a>
                        }
                        {isPDF &&
                            <div>

                                <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
                                <a
                                    href={fileUrl}
                                    target='_blank'
                                    className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'
                                >

                                </a>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
     );
}

export default ChatItem;
