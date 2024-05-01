'use client';

import { useEffect, useState } from 'react';
import { CreateServerModal } from '@/components/modals/create-server-modal'
import { ServerInviteModal } from '../modals/server-invite-modal';
import { ServerSettingsModal } from '../modals/server-settings-modal';
import { ManageMembersModal } from '../modals/manager-members-modal';
import { CreateChannelModal } from '../modals/create-channel-modal';

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
            <ServerSettingsModal />
            <ManageMembersModal />
            <CreateChannelModal />
        </>
    )
}
