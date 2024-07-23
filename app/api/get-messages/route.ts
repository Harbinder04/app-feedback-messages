import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import prisma from "@/db/src/db";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  const userid = user.userid as string;

  try {
    const userWithMessages = await prisma.user.findUnique({
      where: {
        userid: parseInt(userid, 10),
      },
      include: {
        messages: true,
      },
    });

    if (!userWithMessages || userWithMessages.messages.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    // console.log(userWithMessages.messages);
    return Response.json({
        success: true,
        message: userWithMessages.messages
    },
{status: 200})
  } catch (error) {
    // console.error("Error checking user verification", error);
    return Response.json(
      {
        success: false,
        message: "Error while fetching Messages",
      },
      { status: 500 }
    );
  }
}
