"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"

export const resendVerificationAction = async () => {
    const session = await auth()

    if (!session?.user?.id || !session.user.email) {
        return { success: false, error: "Bạn chưa đăng nhập" }
    }

    const { email } = session.user

    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return { success: true }
}
