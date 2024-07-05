"use client";
import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/otpVerify";
import { ApiResponse } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { Loader2 } from "lucide-react";

function Verify() {
  const router = useRouter();
  const param = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/verify-code", {
        userEmail: param.userEmail,
        code: data.code,
      });

      toast({
        title: "OTP verified",
        duration: 800,
      });
      router.replace("/");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg: test-5xl mb-6">Verify Your Account</h1>
          <p className="mb-4">Enter OTP send to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <Input placeholder="code" {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center items-center">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <React.Fragment>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                </React.Fragment>
              ) : (
                "Verify"
              )}
            </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Verify;
