'use client';

import { useEffect, useState } from 'react';
import { CreateServerModal } from '@/components/modals/create-server-modal'
import { ServerInviteModal } from '../modals/server-invite-modal';
export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if(!isMounted){
        return null;
    }

    return (
        <>
            <CreateServerModal />
            <ServerInviteModal />
        </>
    )
}
