import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/db/src/db";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: number } }
) {
  const session = await getServerSession(authOptions);
  const messageid = params.messageid;
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

  const userId = user?.userid as string;
  // console.log(userId ,typeof(messageid));
  try {
    const message = await prisma.message.findFirst({
      where: {
        id: parseInt(messageid.toString(), 10),
        userId: parseInt(userId, 10), // Ensure the message belongs to the user
      },
    });
    // Delete the message
    if (message) {
      const response = await prisma.message.delete({
        where: {
          id: parseInt(messageid.toString(), 10),
          userId: parseInt(userId, 10),
        },
      });
      console.log(response);
      if (!response) {
        return NextResponse.json(
          {
            success: false,
            message: "Unsuccessful",
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Deleted successfully",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error from file",
      },
      { status: 500 }
    );
  }
}
