import { z } from 'zod';

export const userNameValidation = z.string().min(3, "Username must contain 3 characters").max(20, "Character length must be between 20")


export const signUpSchema = z.object({
    username : userNameValidation,
    email: z.string().email().endsWith(".com"),
    password : z.string().min(6, {message: "password must be at least 6 characters"} ).max(15),   
})
