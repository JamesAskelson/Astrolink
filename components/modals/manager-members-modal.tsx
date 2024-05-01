'use client';

import qs from 'query-string'
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldQuestion, ShieldX } from 'lucide-react';
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../profile/user-profile";
import { useModal } from '@/app/hooks/user-modal-store';

import { useState } from 'react';
import { ServerWithMembersWithProfiles } from "@/type";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { MemberRole } from "@prisma/client";
import { useRouter } from 'next/navigation';

const roleIcon = {
    'GUEST': null,
    'ADMIN': <ShieldAlert className='h-5 w-5 text-red-500'/>,
    'MODERATOR': <ShieldX className='h-5 w-5 text-green-600/80'/>
}


export const ManageMembersModal = () => {
    const { type, isOpen, onClose, onOpen, data } = useModal();
    const { server } = data as { server: ServerWithMembersWithProfiles };
    const isModalOpen = isOpen && type === "manageMembers";
    const [loadingId, setLoadingId] = useState('');
    const router = useRouter()

    const onKick = async (memberId: string) => {
        try {
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id
                },
            });

            const res = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if(res.ok){
                const resData = await res.json()
                router.refresh()
                onOpen('manageMembers', {server: resData})
            }
        } catch(error) {
            console.log(error)
        }
    };

    const onRoleChange = async (memberId: string, role: MemberRole) => {
        try {
            setLoadingId(memberId);

            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                    memberId,
                }
            })

            const res = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role })
            })

            if(res.ok){
                const resData = await res.json()
                router.refresh()
                onOpen('manageMembers', { server: resData })
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoadingId('');
        }
    }


    return (
            <Dialog open={isModalOpen} onOpenChange={onClose}>
                <DialogTrigger></DialogTrigger>
                <DialogContent className='text-gray-200 p-0 overflow-hidden'>
                    <DialogHeader className='pt-8 px-6'>
                        <DialogTitle className=' text-gray-700 text-4xl text-center'>
                            Manage Members
                        </DialogTitle>
                        <DialogDescription className='text-center py-4 text-xl'>
                            {server?.members?.length} Members
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="ml-12 mt-8 max-h-420px pr-6">
                        {server?.members?.map((member) => (

                            <div key={member.id} className='flex items-center gap-x-2 mb-6'>
                                <UserAvatar src={member?.profile?.imageUrl}/>
                                <div className="flex flex-col gap-y-1">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        {member?.profile?.userName}
                                        {roleIcon[member.role]}
                                    </div>
                                    <p className='text-slate-400 text-sm'>
                                        {member.profile.email}
                                    </p>
                                </div>
                                {server.profileId !== member.profileId && loadingId !== member.id && (
                                    <div className="ml-auto">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <MoreVertical className="h-5 w-5"/>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent side='left'>
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger className='flex items-center'>
                                                        <ShieldQuestion className="h-5 w-5"/>
                                                        <span className="pl-2">Role</span>
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuItem onClick={() => onRoleChange(member.id, 'GUEST')}>
                                                                <Shield className='h-6 w-6 pl-2' />
                                                                <span className='pl-2'>Guest</span>
                                                                {member.role === "GUEST" && (
                                                                    <Check className="h-6 w-6 pl-2"/>
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => onRoleChange(member.id, 'MODERATOR')}>
                                                                <ShieldX className='h-6 w-6 pl-2 text-red-500' />
                                                                <span className='pl-2'>Moderator</span>
                                                                {member.role === "MODERATOR" && (
                                                                    <Check className="h-6 w-6 pl-2"/>
                                                                )}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => onKick(member.id)}>
                                                    <Gavel className='h-4 w-4 mr-2' />
                                                    Kick
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                                {loadingId === member.id && (
                                    <Loader2 className='animate-spin text-slate-500 ml-auto w-4 h-4' />
                                )}
                            </div>
                        ))}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
    );
}
