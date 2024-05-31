import { Server as MoonServer } from 'http';
import { NextApiRequest } from 'next';
import { Server } from 'socket.io';

import { NextApiResponseServerIo } from '@/type';

export const config = {
    api: {
        bodyParser: false,
    }
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo)=> {
    if(!res.socket.server.io) {
        const path = "/api/socket/io";
        const httpServer: MoonServer = res.socket.server as any;
        const io = new Server(httpServer, {
            path: path,
            addTrailingSlash: false,
        })
        res.socket.server.io = io;
    }

    res.end()
}

export default ioHandler;
