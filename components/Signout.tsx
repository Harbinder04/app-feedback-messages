"use client";

import React from 'react';
import { signOut } from 'next-auth/react';
import { toast } from './ui/use-toast';
import { Button } from './ui/button';
import { useRouter } from "next/navigation";

function Signout() {
    const router = useRouter();

    async function handleSubmit() {
        await signOut({ redirect: false });
        toast({
            title: "Sign out successful",
            duration: 1000
        });
        router.replace('/sign-in');
    }

    return (
        <div>
            <Button onClick={handleSubmit}>
                Sign out 
            </Button>
        </div>
    );
}

export default Signout;
