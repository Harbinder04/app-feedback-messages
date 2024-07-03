import prisma from "@/db/src/db";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    try {
        const {email, code }  = await request.json()

        const decodedEmail = decodeURIComponent(email)
        
        const user = await prisma.user.findFirst({
            where: {
                email: decodedEmail
            }
        })

        if(!user){
            return NextResponse.json({
                success: false,
                message: "Username does not exist"
            },
        {status: 500})
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeExipire = new Date(user.verifyCode) > new Date()
        
        if(isCodeValid && isCodeExipire){
            user.isVerified = true;
            return NextResponse.json({
                success: true,
                message: "Verified Successfully"
            },
        {status: 200})
        } else if(!isCodeExipire){
            return NextResponse.json({
                success: false,
                message: "Code expired"
            },
        {status: 500})
        } else {
            return Response.json({
                success: false,
                message: "Incorrect code"
            },{status: 500})
        }

    } catch (error) {
        console.error('Error checking user verification', error)
        return Response.json({
            success: false,
            message: "Verification Page error "
        },
    {status: 500})
    }
}