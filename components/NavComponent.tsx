"use client"

import { useSession } from 'next-auth/react';
import Signout from './Signout';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation'
import { User } from "next-auth";

export const NavComponent = ()=>{
    const router = useRouter();
    const { data: session } = useSession();
    const user: User = session?.user as User;
    
    return (
        <nav className='p-4 md:p-6 shadow-md'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
            <a className='text-xl font-bold mb-4 md:mb-0'
            href="#">Mystry Message </a>
            {session ? (
                <>
                <span className='mr-2 font-bold'>Welcome, {user?.username}</span>
        <Signout />
        </>) : (<Button className="w-full md:w-auto" onClick={() => router.push('/sign-in')}>Log In</Button>)}
        </div>
    </nav>
    )
}