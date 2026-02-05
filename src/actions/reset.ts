"use server"

import { db } from "@/lib/db"
import { z } from "zod"
import { generatePasswordResetToken } from "@/lib/tokens"
import { sendPasswordResetEmail } from "@/lib/mail"

const resetSchema = z.object({
    email: z.string().email({
        message: "Email không hợp lệ"
    })
})

export const reset = async (formData: FormData) => {
    const email = formData.get("email")
    const validatedFields = resetSchema.safeParse({ email })

    if (!validatedFields.success) {
        return { error: "Email không hợp lệ!" }
    }

    const { email: validatedEmail } = validatedFields.data

    const existingUser = await db.user.findUnique({
        where: { email: validatedEmail }
    })

    if (!existingUser) {
        // Return success even if user not found for security (no enumeration)
        // Or return specific error if prefer UX over security. For this demo:
        return { error: "Email không tồn tại trong hệ thống!" }
    }

    const passwordResetToken = await generatePasswordResetToken(validatedEmail)
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

    return { success: "Link đặt lại mật khẩu đã được gửi!" }
}
