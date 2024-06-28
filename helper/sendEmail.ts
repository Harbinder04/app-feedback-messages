import type { NextApiRequest, NextApiResponse } from 'next';
import { EmailTemplate } from '@/email/EmailTemplate';
import {resend} from '@/lib/resend'
import { ApiResponse } from '@/types/types';

export async function sendEmail(email:string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try{
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: "Demo OTP Verification",
      react: EmailTemplate({username, otp: verifyCode})
    })

    return {
      success: true,
      message: "Email send successfully"
    }
  } catch (emailError){
    console.error('error sending verification email', emailError)
    return {
      success: false,
      message: "Failed to send email"
    }
  }
}
