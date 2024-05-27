import { Server, Member, Profile, Conversation } from '@prisma/client'

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
