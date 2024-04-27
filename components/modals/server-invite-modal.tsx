'use client';

import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { useModal } from '@/app/hooks/user-modal-store';
import { Label } from '../ui/label';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useOrigin } from '@/app/hooks/use-origin';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"

export const ServerInviteModal = () => {
    const { type, isOpen, onClose, onOpen, data } = useModal();
    const origin = useOrigin();
    const { server } = data;

    const inviteLink = `${origin}/invite/${server?.inviteCode}`;

    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isModalOpen = isOpen && type === "invite";

    const onCopy = () => {
        navigator.clipboard.writeText(inviteLink)
        setCopied(true);

        setTimeout(() => {
            setCopied(false)
        }, 1000)
    }

    const onNew = async () => {
        try {
            setIsLoading(true)
            const res = await fetch(`/api/servers/${server?.id}/invite-code`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if(res.ok){
                const resData = await res.json()
                onOpen('invite', { server: resData })
                setIsLoading(false)
            }

        } catch(error){
            console.log(error)
            setIsLoading(false)
        }
    }

    return (
            <Dialog open={isModalOpen} onOpenChange={onClose}>
                <DialogTrigger></DialogTrigger>
                <DialogContent className='text-gray-200 overflow-hidden'>
                    <DialogHeader className='pt-8 px-6'>
                        <DialogTitle className=' text-gray-700 text-4xl text-center'>
                            Invite your Friends!
                        </DialogTitle>
                        <DialogDescription className='text-center py-4'>
                            Use the link below to invite anybody you like to the server!
                        </DialogDescription>
                    </DialogHeader>
                    <div className='p-6'>
                        <Label className='bold text-xs font-bold text-zinc-500 dark:text-indigo-300'>
                            Server Invite
                        </Label>
                        <div className='flex items-center mt-2 gap-x-2'>
                            <Input disabled={isLoading} className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0' value={inviteLink} />
                            <Button disabled={isLoading} size='icon' className='pl-3' onClick={onCopy}>
                                {copied ? <Check className='w-4 h-4'/> :
                                <Copy className='w-4 h-4' />}
                            </Button>
                        </div>
                        <Button
                            disabled={isLoading}
                            onClick={onNew}
                            variant='link'
                            size='sm'
                            className='text-xs text-zinc-500 mt-4 flex'>
                            Generate a new link
                            <RefreshCw className='w-4 h-4 ml-2'/>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
    );
}
