
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
            message: "User is not accepting messages"
        },
    {status: 403})
    }

    const newMessage = messageSchema.safeParse({content});
    if (!newMessage.success) {
      return Response.json({
        success: false,
        message: 'Invalid message content',
      }, {status: 400});
    }

    // Create new message
    const createdMessage = await prisma.message.create({
      data: {
        content,
        userId: user.userid,
      },
    });

    return Response.json({
      success: true,
      message: 'Message sent successfully',
      data: createdMessage,
    }, {status: 200});
   }catch (error) {
    console.error('Error checking user verification', error)
    return Response.json({
        success: false,
        message: "Error while sending message"
    },
{status: 500})
}
}