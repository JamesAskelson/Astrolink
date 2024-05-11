import { currentProfile } from "@/lib/current-profle";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NavigationAction } from "./navigation-action";
import { MoonStar } from "lucide-react";
import { ActionTooltip } from "../ui/action-tooltip";
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "../ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "../ui/theme-button";

export const NavigationSideBar = async () => {
    const profile = await currentProfile()

    if(!profile){
        return redirect('/')
    }

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    return (
        <div className="bg-zinc-300 dark:bg-zinc-700 h-full">
            <div className="flex w-full h-[72px]">
                <ActionTooltip label='Direct Messages' side='right' align='center'>
                    <button className='group flex items-center '>
                        <div className='flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-800 group-hover:bg-emerald-500'>
                            <MoonStar
                            className='group-hover:text-white transition text-emerald-500'
                            />
                        </div>
                    </button>
                </ActionTooltip>
            </div>

            <Separator className="h-[2px] bg-zinc-400  dark:bg-zinc-500  w-16 mx-auto" />

                <ScrollArea className='flex-1 w-full space-y-4'>
                    <div className="space-y-4">
                        {servers.map((server) => (
                            server === null ? null
                            : <NavigationItem id={server.id} name={server.name} imageUrl={server.imageUrl}/>
                        ))}
                    </div>

                    <Separator className="h-[2px] bg-zinc-400 dark:bg-zinc-500  w-16 mx-auto mt-4" />

                    <div className="space-y-4 flex-col items-center h-full text-primary w-full py-3">
                        <NavigationAction />
                    </div>
                </ScrollArea>



            <div className='w-[72px] absolute bottom-0 pb-3 mt-auto flex items-center flex-col gap-y-4 bg-zinc-300 dark:bg-zinc-700'>
            <Separator className=" h-[2px] bg-zinc-200 dark:bg-zinc-500 w-[72px]" />
                <ModeToggle />
                <UserButton
                    afterSignOutUrl='/'
                    appearance={{
                        elements: {
                            avatarBox: 'h-[48px] w-[48px]'
                        }
                    }}
                />
            </div>
        </div>
     );
}
