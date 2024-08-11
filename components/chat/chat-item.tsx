'use client'

import { Member, MemberRole, Profile } from "@prisma/client";
import UserAvatar from "../profile/user-profile";
import { Edit, FileIcon, ShieldAlert, ShieldX } from "lucide-react";
import { ActionTooltip } from "../ui/action-tooltip";
import { isAppPageRouteDefinition } from "next/dist/server/future/route-definitions/app-page-route-definition";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { z } from "zod";
import qs from 'query-string'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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

const formSchema = z.object({
    content: z.string().min(1),
    fileUrl: z.string().optional()
})

const ChatItem = ({id, text, member, timestamp, fileUrl, deleted, currentMember, isUpdated, socketQuery, socketUrl}: ChatItemProps) => {
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false)
    const router = useRouter()

    const fileType = fileUrl?.split(".").pop()

    const isAdmin = currentMember.role == MemberRole.ADMIN;
    const isModerator = currentMember.role == MemberRole.MODERATOR;
    const isOwner = currentMember.id === member.id

    const canDelete = !deleted && (isAdmin || isModerator || isOwner)
    const canEdit = !deleted && isOwner

    const isPDF = fileType === 'pdf' && fileUrl
    const isImage = fileUrl && !isPDF;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: text,
            fileUrl: fileUrl
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
        try {
            const url = qs.stringifyUrl({
                url: socketUrl,
                query: socketQuery
            })

            const res = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values),
            })

            if(res.ok){
                const resData = await res.json()
                form.reset()
                router.refresh()
            }
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <div className="flex p-2 gap-4 hover:bg-slate-700 rounded-sm group relative">
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
                        <div className="hidden absolute top-1 right-2 group-hover:flex ml-px gap-x-2 group-hover:bg-text-zinc-800 dark:bg-zinc-800 border rounded-sm">
                            {canEdit && (
                                <ActionTooltip label='Edit'>
                                    <Edit
                                    onClick={() => setEditing(true)}
                                    className='cursor-pointer ml-auto w-5 h-5 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'/>
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
                    {editing && (
                        <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                    control={form.control}
                    name='content'
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6 pr-6">
                                    {fileUrl && fileUrl.endsWith('.jpg') || fileUrl.endsWith('.png') || fileUrl.endsWith('.jpeg') || fileUrl.endsWith('.gif')  ? (
                                        <img src={fileUrl} alt="Uploaded file" className="absolute bottom-20 max-w-20 max-h-20 rounded" />
                                        ) : (
                                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline absolute bottom-20">
                                            {fileUrl}
                                        </a>
                                    )}
                                    <button
                                    type='button'
                                    onClick={() => onOpen('messageFile', { onImageUpload: handleImageUpload })}
                                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600
                                    dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center">
                                        <Plus />
                                    </button>

                                    <Input
                                    disabled={isLoading}
                                    placeholder={`Message #${name}`}
                                    className='px-14 py-6 bg-slate-800 border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                                    {...field}
                                    />
                                    <div className="absolute top-7 right-8">
                                        <EmojiPicker onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)}/>
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                    />
                </form>
        </Form>
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
