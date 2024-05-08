'use client';

import qs from 'query-string'
import { Button } from '@/components/ui/button';
import { redirect, useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useModal } from '@/app/hooks/user-modal-store';
import { ServerWithMembersWithProfiles } from '@/type';
import { currentProfile } from '@/lib/current-profle';
import { useEffect } from 'react';
import { revalidatePath } from 'next/cache';

export const DeleteChannelModal = () => {
    const { type, isOpen, onClose, data } = useModal();
    const router = useRouter()
    const { channel, server } = data;
    const isModalOpen = isOpen && type === "deleteChannel";



    const deleteChannel = async () => {
        try {
            await fetch(`/api/servers/${server?.id}/channels/${channel?.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            onClose()
            await new Promise(resolve => setTimeout(resolve, 500));
            router.refresh()
            revalidatePath(`/servers/${server?.id}`)
            router.push(`/servers/${server?.id}`)

        } catch(error) {
            console.log(error)
        }
    }

    const closeModal = () => {
        onClose()
    }

    return (
            <Dialog open={isModalOpen} onOpenChange={closeModal}>
                <DialogTrigger></DialogTrigger>
                <DialogContent className='text-gray-200 overflow-hidden'>
                    <DialogHeader className='pt-8 px-6'>
                        <DialogTitle className=' text-gray-700 text-4xl text-center'>
                            Deleteing the Channel?
                        </DialogTitle>
                        <DialogDescription className='text-center py-4'>
                            Once you do, it's gone for good...are you sure this is what you want? This includes any and all posts made in the channel so far.
                        </DialogDescription>

                    </DialogHeader>
                    <div className='flex justify-center gap-32'>
                    <Button className='w-32'
                    variant={'destructive'}
                    onClick={deleteChannel}>
                        YES
                    </Button>
                    <Button className='w-32'
                    variant={'destructive'}
                    onClick={closeModal}
                    >
                        NO
                    </Button>
                    </div>

                </DialogContent>
            </Dialog>
    );
}
