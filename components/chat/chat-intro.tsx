import { Hash } from "lucide-react";

interface ChatIntroProps {
    name: string;
    type: 'channel' | 'conversation'
}


const ChatIntro = ({name, type}: ChatIntroProps) => {


    return (
    <div className="flex flex-col">
        <div className="flex justify-center items-center border rounded-full bg-slate-700 dark:bg-slate-600 w-20 h-20">
            <Hash className="h-16 w-16"/>
        </div>

        {type == 'channel' ?
        <div>
            <div className="text-xl pt-2 dark:text-slate-300">
                {`Welcome to #${name}`}
            </div>
            <div className="text-s pt-2 dark:text-slate-500">
                {`This is the start of the #${name} channel.`}
            </div>
        </div>
             :
        <div>
             <div className="text-xl pt-2 dark:text-slate-300">
                 {`Say hello to ${name}`}
             </div>
             <div className="text-s pt-2 dark:text-slate-500">
                 {`This is the beginning of your conversation with ${name}.`}
             </div>
        </div>}
    </div>
    );
}

export default ChatIntro;
