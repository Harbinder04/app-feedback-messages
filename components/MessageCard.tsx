"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "./ui/use-toast";

type Message = {
  id: number;
  content: string; // Should be `string` instead of `String`
};

type MessageCardProps = {
  message: Message;
  // onMessageDelete: void; // Properly type the callback
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

function MessageCard({ message, setMessages }: MessageCardProps) {
  async function handleDeleteConfirm() {
    try {
      const response = await axios.delete(`/api/messageDelete/${message.id}`);
      console.log(response.data.message);
      setMessages(response.data.message)
      toast({
        title: response.data?.message,
        type: "foreground",
        variant: "destructive",
        duration: 1000,
      });
      // onMessageDelete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the message",
        variant: "destructive",
        duration: 1000,
      });
    }
  }

  return (
    <>
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-fit h-auto self-end">Delete Message</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>
      </Card>
    </>
  );
}

export default MessageCard;
