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

export const DeleteServerModal = () => {
    const { type, isOpen, onClose, data } = useModal();
    const router = useRouter()
    const { server } = data as { server: ServerWithMembersWithProfiles };
    const isModalOpen = isOpen && type === "deleteServer";



    const deleteServer = async () => {
        try {
            await fetch(`/api/servers/${server?.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            onClose()
            await new Promise(resolve => setTimeout(resolve, 500));
            router.push('/')


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
                            Deleteing the Server?
                        </DialogTitle>
                        <DialogDescription className='text-center py-4'>
                            Once you do, it's gone for good...are you sure this is what you want?
                        </DialogDescription>

                    </DialogHeader>
                    <div className='flex justify-center gap-32'>
                    <Button className='w-32'
                    variant={'destructive'}
                    onClick={deleteServer}>
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
