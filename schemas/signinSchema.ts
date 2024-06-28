import { z } from 'zod';

export const signInSchema = z.object({
    email: z.string().email().endsWith(".com"),
    password : z.string().min(6, {message: "password must be at least 6 characters"} ).max(15)  
})