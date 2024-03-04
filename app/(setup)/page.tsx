import InitialModal from "@/components/modals/initial-modal";
import InitialProfile from "@/lib/initial-profile";
import prisma from "@/lib/prismadb";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const profile = await InitialProfile();

  const server = await prisma.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModal />;
};

export default SetupPage;
