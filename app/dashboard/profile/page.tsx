import  {prisma}  from "@/app/lib/db";
import { auth } from "@clerk/nextjs/server";

export default async function ProfilePage() {

    const {userId  } = await auth();

    const user = await prisma.player.findUnique({
        where: {clerkId: userId!},
        select: {
            email:true
        }
    })
    return (
        <>
        <div>

        </div>
        </>
    )
}