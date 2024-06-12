'use client'

import { Member, Message, Profile } from "@prisma/client";
import ChatIntro from "./chat-intro";
import { useChatQuery } from "@/app/hooks/use-chat-query";
import { LoaderIcon, ServerCrash } from "lucide-react";
import { Fragment } from "react";

type MessageWithMememberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation"
}

const ChatMessages = ({name, member, chatId, apiUrl, socketUrl, socketQuery, paramKey, paramValue, type}: ChatMessagesProps) => {
    const queryKey = `chat:${chatId}`
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramVal: paramValue
    })

    if(status === 'pending'){
        return (
            <div className="flex flex-col flex-1 justify-content items-center">
                <LoaderIcon className="h-7 w-7 text-zinc-500 my-4" />
                <p>
                    Loading messages...
                </p>
            </div>
        )
    }

    if(status === 'error') {
        return (
            <div className="flex flex-col flex-1 justify-content items-center">
                <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
                <p>
                    Error Connecting...
                </p>
            </div>
        )
    }



    return (
        <div className="pl-4 flex-1 flex flex-col py-4 overflow-y-auto">
            <div className="flex-1"></div>
            <ChatIntro type={type} name={name} />
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group.items.map((message: MessageWithMememberWithProfile) => (
                            <div key={message.id}>
                                {message.text}
                            </div>
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
     );
}

export default ChatMessages;
