"use client";

import { usePathname } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/types";

const UsernamePage = () => {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const username = segments.length > 2 ? segments[2] : "unknown";
  const [message, setMessage] = useState("");
  const [isEmptyMessage, setIsEmptyMessage] = useState(false);
  const { toast } = useToast();

  function handleTextChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void {
    setMessage(event.target.value);
  }

  const handleSendMessage = async () => {
    try {
      // console.log("Point check 1");
      setMessage(message);
      if (message.length <= 0) {
        setIsEmptyMessage(true);
        return;
      }
      // console.log("Point check 2");
      const response = await axios.post("/api/send-message", {
        email: username,
        content: message,
      });
      // console.log("Point check 3");
      if (response) {
        toast({
          title: "Successfull",
          description: "Message send successfully",
          duration: 1000,
        });
      } else {
        toast({
          title: "Unsuccessfull",
          description: "Message not send successfully",
          duration: 1000,
          variant: "destructive",
        });
      }
    } catch (error) {
      const axiaosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiaosError.message,
        duration: 1000,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="mx-4">
        <div className="flex items-center justify-center mt-10">
          <h1 className="text-3xl font-bold">Public Profile Link</h1>
        </div>
        <p className="my-2">
          Send Anonymous Messages to{" "}
          <span className="font-semibold">@{username.split("@")[0]}</span>
        </p>
        <div className="my-4">
          <Textarea
            placeholder="Type your message here."
            onChange={handleTextChange}
          />
          {isEmptyMessage ? (
            <p className="text-red-500">Message must not be empty.</p>
          ) : (
            <p></p>
          )}
        </div>
        <div className="flex justify-center">
          <Button onClick={handleSendMessage}>Send </Button>
        </div>

        <Button className="mt-10">Suggest Messages</Button>
      </div>
    </>
  );
};

export default UsernamePage;
