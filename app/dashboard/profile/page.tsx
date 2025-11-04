import { prisma } from "@/app/lib/db";
import { auth } from "@clerk/nextjs/server";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) return <div>Please sign in.</div>;

  const user = await prisma.player.findUnique({
    where: { clerkId: userId },
  });

  return <div>{user?.email ?? "User not found"}</div>;
}
