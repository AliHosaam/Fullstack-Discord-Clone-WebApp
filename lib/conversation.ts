import prisma from "@/lib/prismadb";

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));

  if (!conversation) {
    let conversation = await createNewConversation(memberOneId, memberTwoId);

    return conversation;
  }

  return conversation;
};

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  return await prisma.conversation.findFirst({
    where: {
      AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
    },
    include: {
      memberOne: {
        include: {
          profile: true,
        },
      },
      memberTwo: {
        include: {
          profile: true,
        },
      },
    },
  });
};

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    return await prisma.conversation.create({
      data: {
        memberOneId: memberOneId,
        memberTwoId: memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};
