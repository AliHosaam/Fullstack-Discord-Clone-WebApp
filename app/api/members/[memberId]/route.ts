import currentProfile from "@/lib/current-profile";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      memberId: string;
    };
  }
) {
  try {
    const { role } = await req.json();
    const { searchParams } = new URL(req.url);
    const profile = await currentProfile();

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.memberId) {
      return new NextResponse("Member ID is Missing", { status: 400 });
    }

    if (!serverId) {
      return new NextResponse("Server ID is Missing", { status: 400 });
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role: role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      memberId: string;
    };
  }
) {
  try {
    const { searchParams } = new URL(req.url);
    const profile = await currentProfile();

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.memberId) {
      return new NextResponse("Member ID is Missing", { status: 400 });
    }

    if (!serverId) {
      return new NextResponse("Server ID is Missing", { status: 400 });
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server", { status: 500 });
  }
}
