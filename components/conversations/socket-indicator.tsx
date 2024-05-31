'use client'

import { useSocket } from "../providers/socket-provider"
import { Badge } from "../ui/badge"

export const SocketIndicator = () => {
    const { isConnected } = useSocket();
    if(!isConnected){
        return (
            <Badge variant='outline' className="bg-orange-200 text-white border-none">
                Not Connected, Retrying...
            </Badge>
        )
    }

    return (
        <Badge variant='outline' className=" text-white border-none bg-green-500">
            Connection Successful
        </Badge>
    )
}
