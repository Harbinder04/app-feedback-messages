import { number, z } from 'zod';

export const verifySchema = z.object({
    code: z.string()
    .length(4, { message: "Verification code must be 4 digits" })
    .regex(/^\d{4}$/, { message: "Verification code must be numeric" })
})