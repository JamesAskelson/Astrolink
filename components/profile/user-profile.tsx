import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "../ui/avatar";

interface MemberProps {
    src?: string;
    className?: string;
}


const UserAvatar = ({src, className}: MemberProps ) => {
    console.log()
    return (
        <Avatar className={cn(
            'h-7 w-7 md:h-10 md:w-10'
        )}>
            <AvatarImage src={src} />
        </Avatar>
     );
}

export default UserAvatar;
