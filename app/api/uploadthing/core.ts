
import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const authHandler = () => {
    const userId = auth()
    if(!userId){
        throw new Error('Unauthorized')
    }
    return { userId: userId }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    serverImage: f({image: {maxFileSize: '4MB', maxFileCount: 1 }})
        .middleware(() => authHandler())
        .onUploadComplete(() => {}),
    messageMedia: f(['image', 'image/gif', 'pdf', 'video', 'video/webm'])
        .middleware(() => authHandler())
        .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
