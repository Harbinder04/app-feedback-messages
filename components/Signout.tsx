"use client";

import React from 'react';
import { signOut } from 'next-auth/react';
import { toast } from './ui/use-toast';
import { Button } from './ui/button';
// import { useRouter } from "next/navigation";

function Signout() {
    // const router = useRouter();

    async function handleSubmit() {
        await signOut();
        toast({
            title: "Sign out successful",
            duration: 1000
        });
    }

    return (
        <>
            <Button className="w-full md:w-auto" onClick={handleSubmit}>
                Sign out 
            </Button>
        </>
    );
}

export default Signout;
