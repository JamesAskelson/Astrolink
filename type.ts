import { Server, Member, Profile, Conversation } from '@prisma/client'
import { NextApiResponse } from 'next';
import { Server as MoonServer, Socket } from 'net'
import { Server as SocketIOServer } from 'socket.io';

// this util is nessessary for when you have an interface for a server that includes members and their profiles

export type ServerWithMembersWithProfiles = Server & {
    members: (Member & {
        profile: Profile
    })[];
}

export type ProfileWithConverstations = Profile & {
    conversationInitiated: Conversation[],
    conversationReceived: Conversation[],
}

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: MoonServer & {
            io: SocketIOServer;
        }
    }
}
