import { Channel } from "@prisma/client";
import { Hash,} from "lucide-react";
import MobileServerMenu from "../menu/mobile-server-menu";

interface ChannelHeaderProps {
    serverId: string;
    name: string;
    type: 'channel' | 'conversation';
    imageUrl?: string;
}



const ChannelHeader = ({serverId, name, type}: ChannelHeaderProps) => {


    return (
        <div className="flex justify-between text-md items-center p-2 dark:bg-zinc-800/70 p-auto h-11 border-b-2">
            <div className="pl-2 flex gap-2 items-center">
                <MobileServerMenu serverId={serverId} />
                {type === 'channel' && (
                    <Hash className=' text-slate-500'/>
                )}
                <p className="dark:text-slate-300">
                    {name}
                </p>
            </div>
            <div className="pr-4">
                wow
            </div>


        </div>
     );
}

export default ChannelHeader;
