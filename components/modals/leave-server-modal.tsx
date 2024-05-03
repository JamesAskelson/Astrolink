'use client';

import qs from 'query-string'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
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

export const LeaveServerModal = () => {
    const { type, isOpen, onClose, data } = useModal();
    const router = useRouter()
    const { server } = data as { server: ServerWithMembersWithProfiles };
    const isModalOpen = isOpen && type === "leaveServer";



    const leaveServer = async () => {
        try {

            const res = await fetch(`/api/servers/${server?.id}/leave`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            })


            if(res.ok){
                router.refresh()
                router.push('/')
                onClose()
            }

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
                            Leaving the Server?
                        </DialogTitle>
                        <DialogDescription className='text-center py-4'>
                            Are you sure you want to leave?
                        </DialogDescription>

                    </DialogHeader>
                    <div className='flex justify-center gap-32'>
                    <Button className='w-32'
                    variant={'destructive'}
                    onClick={leaveServer}>
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
