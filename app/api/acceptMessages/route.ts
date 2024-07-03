import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import prisma from "@/db/src/db";
import { User } from 'next-auth'
import { NextResponse } from "next/server";


export async function POST(request: Request) {
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
    const { isAcceptingMessage } = await request.json();
    try {
        const updatedUser = await prisma.user.update({
            where: {
                userid: parseInt(userid, 10)
            },
            data: {
                isAcceptingMessage: isAcceptingMessage
            }
        })
        if(!updatedUser){
            return Response.json({
                success: false,
                message: "User not found"
            },
        {status: 401})
        }
        return Response.json({
            success: true,
            message: "Acceptance status updated successfully"
        },
    {status: 200})
    }
    catch (error) {
        console.error('Error checking user verification', error)
        return Response.json({
            success: false,
            message: "Error while toggling"
        },
    {status: 500})
    }
}

export async function GET(request: Request) {
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

    try {
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
        return Response.json({
            success: true,
            isAcceptingMessage: foundUser.isAcceptingMessage,
            message: "Acceptance status fetched successfully"
        },
    {status: 200})
    }
    catch (error) {
        console.error('Error checking user verification', error)
        return Response.json({
            success: false,
            message: "Error while toggling"
        },
    {status: 500})
    }
}