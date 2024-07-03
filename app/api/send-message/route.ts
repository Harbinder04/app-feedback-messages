
import prisma from "@/db/src/db";
import {messageSchema} from '@/schemas/message'

export async function POST(req: Request) {
   const {email, content} = await req.json();
   try {
    const user = await prisma.user.findFirst({
        where: {
            email: email
        },
        include: {
            messages: true,
          },
    })
    if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            },
        {status: 404})
    }

    // is user accepting messages

    if(!user.isAcceptingMessage){
        return Response.json({
            success: false,
            message: "User not found"
        },
    {status: 403})
    }
    const newMessage = messageSchema.safeParse(content);
    if(newMessage){
        user.messages.push(content)
    }
    else{
        return Response.json({
            success: false,
            message: "Incorrect message format"
        },
    {status: 401})
    }
   }catch (error) {
    console.error('Error checking user verification', error)
    return Response.json({
        success: false,
        message: "Error while sending message"
    },
{status: 500})
}
}