import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { NavigationSideBar } from "../navigation/navigation-sidebar";
import ServerChannelSidebar from "../server/server-channel-sidebar";
import { Button } from "../ui/button";

const MobileServerMenu = ({ serverId }: {serverId: string}) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className="md:hidden">
                    <Menu className="ml-2"/>
                </Button>
            </SheetTrigger>
            <SheetContent side='left' className='p-0 flex gap-0'>
                <div className='w-[72px] h-full'>
                    <NavigationSideBar />
                </div>
                <ServerChannelSidebar serverId={serverId} />
            </SheetContent>
        </Sheet>
     );
}

export default MobileServerMenu;
