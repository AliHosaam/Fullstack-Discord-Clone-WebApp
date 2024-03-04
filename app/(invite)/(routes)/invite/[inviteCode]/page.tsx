import currentProfile from "@/lib/current-profile";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import prisma from "@/lib/prismadb";

interface InviteCodeProps {
  params: {
    inviteCode: string;
  };
}

const InviteCode: React.FC<InviteCodeProps> = async ({ params }) => {
  const profile = await currentProfile();

  if (!profile) {
    return <RedirectToSignIn />;
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  const existingServer = await prisma.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await prisma.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }
};

export default InviteCode;
