import Head from 'next/head';
import * as React from 'react';

interface EmailTemplateProps {
  username: string;
  otp: string
}

export function EmailTemplate({username, otp}: EmailTemplateProps){
  return <div>
    <h1>OTP Validation</h1>
    Hello, {username}
    <p>Here is your otp expire in 1 day : {otp}</p>
    <p>Get verified.</p>
  </div>
}
