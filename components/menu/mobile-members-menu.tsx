import { Menu, Users } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { NavigationSideBar } from "../navigation/navigation-sidebar";
import ServerChannelSidebar from "../server/server-channel-sidebar";
import { Button } from "../ui/button";
import ServerMembersSidebar from "../server/server-members-sidebar";

const MobileMembersMenu = ({ serverId }: {serverId: string}) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className="md:hidden">
                    <Users className="ml-2"/>
                </Button>
            </SheetTrigger>
            <SheetContent side='right' className='p-0 flex gap-0'>
                <ServerMembersSidebar serverId={serverId} />
            </SheetContent>
        </Sheet>
     );
}

export default MobileMembersMenu;
