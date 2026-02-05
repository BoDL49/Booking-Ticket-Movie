import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"
import authConfig from "@/auth.config"

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const validatedFields = loginSchema.safeParse(credentials)

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data

                    const user = await db.user.findUnique({
                        where: { email },
                    })

                    if (!user || !user.password) return null

                    const passwordsMatch = await bcrypt.compare(password, user.password)

                    if (passwordsMatch) return user
                }

                return null
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token }) {
            if (!token.sub) return token

            const existingUser = await db.user.findUnique({
                where: { id: token.sub }
            })

            if (!existingUser) return token

            token.role = existingUser.role
            return token
        },
        async session({ session, token }) {
            // Re-implement or call the one from authConfig?
            // Since we need the token.role to be populated *here*, and the one in authConfig 
            // checks for it.
            // But let's just copy the logic to be safe or ensure it works.
            // Actually, merging callbacks might be tricky.
            // Let's explicitly define the callbacks here to be sure, using the logic we had.
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            if (token.role && session.user) {
                session.user.role = token.role
            }
            return session
        }
    }
})
