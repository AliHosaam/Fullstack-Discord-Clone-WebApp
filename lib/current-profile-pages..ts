import prisma from "@/lib/prismadb";
import { NextApiRequest } from "next";
import { getAuth } from "@clerk/nextjs/server";

const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) return null;

  const profile = await prisma.profile.findUnique({
    where: {
      userId: userId,
    },
  });

  return profile;
};

export default currentProfilePages;
