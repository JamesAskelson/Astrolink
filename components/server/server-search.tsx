'use client'

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, Command, CommandDialog  } from "../ui/command";
import { useParams, useRouter } from "next/navigation";

interface ServerSearchProps {
    data: {
        label: string;
        type: 'channel' | 'member',
        data: {
            icon: React.ReactNode;
            name: string;
            id: string;
            profId?: string | undefined;
        }[] | undefined
    }[]
}

const ServerSearch = ({data}: ServerSearchProps) => {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const params = useParams()

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
          if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            setOpen((open) => !open)
          }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
      }, [])

      const onClick = ({id, type, profId}: {id: string, type: 'channel' | 'member', profId: string | undefined}) => {
            setOpen(false)
            if(type === 'member'){
                return router.push(`/conversations/${profId}`)
            }

            if(type === 'channel'){
                return router.push(`/servers/${params?.serverId}/channels/${id}`)
            }
      }

    return (
        <>
            <button onClick={() => setOpen(true)} className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full bg-zinc-300 dark:bg-zinc-500 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/90 transition">
                <Search className=" w-4 h-4" />
                <p className="font-bold text-sm text-zinc-500 dark:text-zinc-300 group-hover:text-zinc-500 dark:hover:text-zinc-300">
                    Search
                </p>
                <kbd className="bg-zinc-600 dark:bg-zinc-600/50 pointer-events-none inline-flex h-5 select-none items-center gap-1 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>
            <Command>
                <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput placeholder="Search for channels and members" />
                    <CommandList>
                        <CommandEmpty>
                            No Results Found
                        </CommandEmpty>
                        {data.map(({ label, type, data }) => {
                            if(!data?.length) return null;

                            return (
                                <CommandGroup key={label} heading={label}>
                                    {data?.map(({id, icon, name, profId}) => {
                                        return (
                                            <CommandItem key={id} onSelect={() => onClick({ id, type, profId})} className="gap-2 cursor-pointer dark:hover:bg-slate-400">
                                                {icon}
                                                <span>{name}</span>
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            )
                        })}
                    </CommandList>
                </CommandDialog>
            </Command>
        </>
     );
}

export default ServerSearch;
