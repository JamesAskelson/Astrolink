'use client';

import { ServerWithMembersWithProfiles } from "@/type";
import { MemberRole } from "@prisma/client";
import { DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger, } from "../ui/dropdown-menu";
import { ChevronDown, UserPlus, Wrench, ListPlus, Trash2, DoorOpen, UserRound } from "lucide-react";
import { useModal } from "@/app/hooks/user-modal-store";

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles;
    role?: MemberRole
}

const ServerChannelHeader = ({server, role}: ServerHeaderProps) => {
    console.log('serversidebar', server)
    const { onOpen } = useModal()

    const isAdmin = role === MemberRole.ADMIN
    const isModerator = role === MemberRole.MODERATOR

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none" asChild>
                    <button className="w-full font-semibold px-6 flex items-center h-12 border-neutral-300 dark:border-neutral-900 border-b-4 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
                        {server.name}
                    <ChevronDown className='h-5 w-5 ml-auto' />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]'>
                    {(isModerator || isAdmin) &&
                    (<DropdownMenuItem onClick={() => onOpen('invite', { server })}className='text-indigo-300 focus:text-indigo-600 cursor-pointer'>
                        Invite People
                    <UserPlus className='h-5 w-5 ml-auto' />
                    </DropdownMenuItem>)
                    }
                    {isAdmin &&
                    (<DropdownMenuItem onClick={() => onOpen('serverSettings', { server })} className='text-gray-400 focus:text-gray-600 dr:focus:text-gray-800 cursor-pointer'>
                        Server Settings
                        <Wrench className='h-5 w-5 ml-auto' />
                    </DropdownMenuItem>)
                    }
                    {isAdmin &&
                    (<DropdownMenuItem onClick={() => onOpen('manageMembers', { server })} className='text-gray-400 focus:text-gray-600 dr:focus:text-gray-800 cursor-pointer'>
                        Manage Members
                        <UserRound className='h-5 w-5 ml-auto' />
                    </DropdownMenuItem>)
                    }
                    {(isModerator || isAdmin) &&
                    (<DropdownMenuItem onClick={() => onOpen('createChannel', { server })} className='text-gray-400 focus:text-gray-600 dr:focus:text-gray-800 cursor-pointer'>
                        Create Channel
                        <ListPlus className='h-5 w-5 ml-auto' />
                    </DropdownMenuItem>)
                    }
                    {!isAdmin &&
                    (<DropdownMenuItem onClick={() => onOpen('leaveServer', { server })} className='text-red-500 focus:text-red-600 cursor-pointer'>
                        Leave Server
                        <DoorOpen className='h-5 w-5 ml-auto' />
                    </DropdownMenuItem>)
                    }
                    {isAdmin &&
                    (<DropdownMenuItem onClick={() => onOpen('deleteServer', { server })} className='text-red-500 focus:text-red-600 cursor-pointer'>
                        Delete Server
                        <Trash2 className='h-5 w-5 ml-auto' />
                    </DropdownMenuItem>)
                    }

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
     );
}

export default ServerChannelHeader;
