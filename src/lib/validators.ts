import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})


export const createDriverSchema = z.object({

    name: z
        .string()
        .min(2, 'Name required'),

    email: z
        .string()
        .email('Invalid email'),

    phone: z
        .string()
        .min(10, 'Invalid phone'),

    password: z
        .string()
        .min(8, 'Minimum 8 characters'),

    assignedArea: z.enum([
        'seattle',
        'bay_area'
    ])

})

export type CreateDriverFormData =
    z.infer<typeof createDriverSchema>

export type LoginFormData = z.infer<typeof loginSchema>