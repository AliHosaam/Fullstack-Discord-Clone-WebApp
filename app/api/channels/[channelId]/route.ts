import currentProfile from "@/lib/current-profile";
import prisma from "@/lib/prismadb";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: { channelId: string };
  }
) {
  try {
    const profile = await currentProfile();

    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!serverId) {
      return new NextResponse("Server ID is Missing", { status: 400 });
    }

    if (!params.channelId) {
      return new NextResponse("Channel ID is Missing", { status: 400 });
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            NOT: {
              name: "general",
            },
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

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: { channelId: string };
  }
) {
  try {
    const profile = await currentProfile();

    const body = await request.json();
    const { name, type } = body;

    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!serverId) {
      return new NextResponse("Server ID is Missing", { status: 400 });
    }

    if (!params.channelId) {
      return new NextResponse("Channel ID is Missing", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Name can not be 'general'", { status: 400 });
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: params.channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name: name,
              type: type,
            },
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
