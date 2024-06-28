import prisma from "@/db/src/db";
import { signUpSchema } from "@/schemas/signupSchema";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helper/sendEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = req.json();
    console.log("I get payload");
    // checking the user who signup mannually
    try {
      const verifyPayload = signUpSchema.safeParse(payload);
      if (!verifyPayload) {
        return NextResponse.json({ msg: "Input Incorrect" }, { status: 401 });
      }
    } catch (error: any) {
      console.error(error);
      return NextResponse.json(
        {
          success: false,
          msg: error?.data,
        },
        {
          status: 401,
        }
      );
    }
    // console.log("checkpoint 1")
    const { username, email, password } = await payload;
    const existUserByValidation = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (existUserByValidation && existUserByValidation.isVerified == true) {
      return NextResponse.json(
        {
          success: false,
          msg: "user already exist. Try Log In",
        },
        { status: 401 }
      );
    }else {
      const verifyCode = Math.floor(1000 + Math.random() * 8999).toString();

      const hashPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      console.log("Check point 2");
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashPassword,
          verifyCode,
          verifyCodeExpiry: expiryDate,
          isVerified: false,
          isAcceptingMessage: true,
          // messages: []  // not all allowed
        },
      });

      if (!newUser) {
        {
          return NextResponse.json(
            {
              success: false,
              message: "Error while creating user. Try again!",
            },
            { status: 500 }
          );
        }
      }
      //send verification email
      const emailResponse = await sendEmail(email, username, verifyCode);

      if (!emailResponse.success) {
        return NextResponse.json(
          {
            success: false,
            message: emailResponse.messages,
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        {
          success: true,
          message: "User registered successfully. Please verify your email",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error registering user", error);
    return NextResponse.json(
      {
        success: false,
        msg: "Error in registering",
      },
      {
        status: 500,
      }
    );
  }
}
