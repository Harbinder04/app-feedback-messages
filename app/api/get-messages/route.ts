import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import prisma from "@/db/src/db";
import { User } from 'next-auth'
import { NextResponse } from "next/server";

export async function GET(req: Request){
    const session = await getServerSession(authOptions);

    console.log(session)

    const user: User  = session?.user as User

    if(!session || !user){
        return NextResponse.json({
            success: false,
            message: "Not Authenticated"
        },
    {status: 401})
    }

    const userid = user.userid as string;
     const { isAcceptingMessage } = await req.json();

     try{
        const foundUser = await prisma.user.findFirst({
            where: {
                userid: parseInt(userid, 10)
            },
        })

        if(!foundUser){
            return Response.json({
                success: false,
                message: "User not found"
            },
        {status: 401})
        }
     }catch (error) {
        console.error('Error checking user verification', error)
        return Response.json({
            success: false,
            message: "Error while fetching Messages"
        },
    {status: 500})
    }
}