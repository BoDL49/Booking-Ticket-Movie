"use server"

import { db } from "@/lib/db"
import { z } from "zod"
import bcrypt from "bcryptjs"

const newPasswordSchema = z.object({
    password: z.string().min(6, "Mật khẩu phải tối thiểu 6 ký tự"),
})

export const newPassword = async (formData: FormData, token: string | null) => {
    if (!token) {
        return { error: "Thiếu mã xác thực!" }
    }

    const password = formData.get("password")
    const validatedFields = newPasswordSchema.safeParse({ password })

    if (!validatedFields.success) {
        return { error: "Mật khẩu không hợp lệ!" }
    }

    const { password: newPassword } = validatedFields.data

    const existingToken = await db.passwordResetToken.findUnique({
        where: { token }
    })

    if (!existingToken) {
        return { error: "Mã xác thực không đúng hoặc đã hết hạn!" }
    }

    const hasExpired = new Date(existingToken.expires) < new Date()

    if (hasExpired) {
        return { error: "Link đặt lại mật khẩu đã hết hạn!" }
    }

    const existingUser = await db.user.findUnique({
        where: { email: existingToken.email }
    })

    if (!existingUser) {
        return { error: "Email không tồn tại!" }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await db.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword }
    })

    await db.passwordResetToken.delete({
        where: { id: existingToken.id }
    })

    return { success: "Mật khẩu đã được đặt lại thành công!" }
}
