'use client';

import {useSession, signIn } from "next-auth/react"

function page() {
  return (
    <div>
        <button className="bg-blue-950 text-white border-white p-2 font-bold rounded-lg" onClick={() => signIn()}>Sign in</button>
    </div>
  )
}

export default page