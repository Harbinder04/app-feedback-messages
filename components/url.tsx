"use client";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

function CopyLinkArea() {
    const { data: session } = useSession();
    const email = session?.user?.email;
    const [profileURL, setProfileURL] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        if (email) {
            // console.log("here 1")
            const baseURL = `${window.location.protocol}//${window.location.host}`;
            // console.log("here 2");
            setProfileURL(`${baseURL}/u/${email}`);
        }
    }, [email]);

    function copyToClipboard() {
        navigator.clipboard.writeText(profileURL);
        toast({
            title: "Copied",
            duration: 1000,
            variant: 'default',
        });
    }

    return (
        <div className="flex items-center">
            <input
                type="text"
                value={profileURL}
                disabled
                className="input input-bordered w-full p-2 mr-2"
            />
            <Button onClick={copyToClipboard}>Copy</Button>
        </div>
    );
}

export default CopyLinkArea;
