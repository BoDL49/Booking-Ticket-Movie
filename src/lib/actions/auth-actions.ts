"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { z } from "zod"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
})

const registerSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export async function loginAction(values: z.infer<typeof loginSchema>) {
    const validatedFields = loginSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Invalid fields!" }
    }

    const { email, password } = validatedFields.data
    console.log("Attempting login for:", email) // DEBUG

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/",
        })
    } catch (error) {
        console.log("Login Action Error:", error) // DEBUG Log
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Email hoặc mật khẩu không chính xác!" }
                default:
                    return { error: "Đã có lỗi xảy ra!" }
            }
        }
        throw error
    }
}

export async function registerAction(values: z.infer<typeof registerSchema>) {
    const validatedFields = registerSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Invalid fields!" }
    }

    const { email, password, name } = validatedFields.data

    const existingUser = await db.user.findUnique({
        where: { email },
    })

    if (existingUser) {
        return { error: "Email already in use!" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    })

    return { success: "Account created! Please login." }
}
