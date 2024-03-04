import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prismadb";

const currentProfile = async () => {
  const { userId } = auth();

  if (!userId) return null;

  const profile = await prisma.profile.findUnique({
    where: {
      userId: userId,
    },
  });

  return profile;
};

export default currentProfile;
