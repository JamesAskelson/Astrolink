import InitialModal from "@/components/modals/initial-modal";
import { ModeToggle } from "@/components/ui/theme-button";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const SetupPage = async () => {
    const profile = await initialProfile()

    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if(server) {
        redirect(`/servers/${server.id}`)
    }


    return (
        <div>
            Create a Server
            <ModeToggle />
            <InitialModal />
        </div>
     );
}

export default SetupPage;
