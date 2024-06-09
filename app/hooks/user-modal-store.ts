import { Channel, ChannelType, Server } from '@prisma/client';
import { create } from 'zustand'

export type ModalType = 'createServer' | 'invite' | 'serverSettings' | 'manageMembers' | 'createChannel' | 'leaveServer' | 'deleteServer' | 'editChannel' | 'deleteChannel' | "messageFile";

interface ModalData {
    server?: Server;
    channel?: Channel;
    channelType?: ChannelType;
    apiUrl?: string;
    query?: Record<string, any>;
    onImageUpload?: (url: any) => void;
}

interface ModalStore {
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data={}) => set({type, isOpen: true, data}),
    onClose: () => set({ type: null, isOpen: false})
}))
