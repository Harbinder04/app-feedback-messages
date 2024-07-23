"use client";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { acceptSchema } from "@/schemas/acceptMessSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";
import CopyLinkArea from "@/components/url";
import { NavComponent } from "@/components/NavComponent";


type message = {
  id: number;
  content: string;
};

function page() {
  const [messages, setMessages] = useState<message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptSchema),
  });
  const { register, watch, setValue } = form;
  // console.log(watch("acceptMessages"));
  const acceptMessages: boolean = watch("acceptMessages");


  const fetchAcceptMessage = useCallback(async () => {
    try {
      const response: any = await axios.get<ApiResponse>("/api/acceptMessages");
      setValue("acceptMessages", response.data?.isAcceptingMessage);
    } catch (error) {
      const axiaosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiaosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/get-messages");
        // console.log(response.data);
        setMessages(response.data.message);
        if (refresh) {
          setIsLoading(true);
          setMessages(response.data.message);
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.message ||
            "Failed to fetch message settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setMessages]
  );
   
   //handle switch change

   const handleSwitchChange = async () => {
    try {
      const response = await axios.post("/api/acceptMessages", {
        isAcceptingMessage: !acceptMessages,
      });
      setValue("acceptMessages", response.data.isAcceptingMessage);
      // console.log(response.data.isAcceptingMessage);
      if(acceptMessages){
      toast({
        title: "Stop receiving Messages",
        description: "Nobody can send message now.",
        duration: 1000,
      })
    }else{
      toast({
        title: "Start receiving Messages",
        description: "Everyone can send message now.",
        duration: 1000,
      })
    }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, fetchMessages]);


  return (
    <>
      <NavComponent />
      <div className="my-8 mx-4 md:mx:8 lg:mx-auto p-6 bg-white rounded w-full max">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
          <CopyLinkArea />
        </div>

        <div className="mb-4 border-b-2 border-gray-400">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessages ? "On" : "Off"}
          </span>
        </div>

        <Button
          className="mt-4"
          variant={"outline"}
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            <>
              {messages.map((message, index) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  setMessages={setMessages}
                />
              ))}
            </>
          ) : (
            <>
              <p>No message to display</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default page;
