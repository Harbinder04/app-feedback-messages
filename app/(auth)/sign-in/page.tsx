'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signInSchema } from '@/schemas/signinSchema';
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/types';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

function Signin() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	// const router = useRouter();
	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof signInSchema>) => {
		setIsSubmitting(true);
		try {
			const response = await axios.post('/sign-in', data);
			console.log(response.data);
			router.replace('/home');
			console.log('after');
			toast({
				title: 'Successfull',
				description: 'Sign in successfully',
				type: 'foreground',
				duration: 1000,
			});
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			let errorMessage = axiosError.response?.data.message;
			toast({
				title: 'Sign In Failed',
				description: errorMessage,
				color: 'red',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='flex justify-center items-center min-h-screen bg-gray-100'>
			<div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
				<div className='flex justify-center items-center text-4xl font-semibold text-center'>
					Leverage Power of Anonymity
				</div>
				<div className='flex justify-center items-center text-md font-semibold text-center'>
					Message Anyone Around the world Freely
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder='Email' {...field} type='text' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name='password'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input placeholder='Password' {...field} type='password' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit' disabled={isSubmitting}>
							{isSubmitting ? (
								<React.Fragment>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' /> Loading...
								</React.Fragment>
							) : (
								'Sign In'
							)}
						</Button>
					</form>
				</Form>
				<div className='text-center mt-4'>
					<p>
						Already a member?{' '}
						<Link href='/sign-up' className='text-blue-500 hover:text-blue-400'>
							Sign Up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Signin;
