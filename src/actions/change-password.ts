"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import bcrypt from "bcryptjs"

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới")
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
})

export async function changePasswordAction(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) {
        return { success: false, error: "Bạn chưa đăng nhập" }
    }

    const rawData = {
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmPassword")
    }

    const validatedFields = changePasswordSchema.safeParse(rawData)

    if (!validatedFields.success) {
        const errorMsg = Object.values(validatedFields.error.flatten().fieldErrors).flat()[0]
        return { success: false, error: errorMsg || "Dữ liệu không hợp lệ" }
    }

    const { currentPassword, newPassword } = validatedFields.data

    try {
        const user = await db.user.findUnique({
            where: { id: session.user.id }
        })

        if (!user || !user.password) {
            // Handle case where user might have signed in with OAuth (no password)
            // But current schema implies password login mostly
            if (!user?.password) return { success: false, error: "Tài khoản này chưa thiết lập mật khẩu (đăng nhập bằng Google/Facebook?)" }
        }

        const passwordsMatch = await bcrypt.compare(currentPassword, user.password!)

        if (!passwordsMatch) {
            return { success: false, error: "Mật khẩu hiện tại không đúng" }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await db.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword }
        })

        return { success: true }
    } catch (error) {
        console.error("Change password error:", error)
        return { success: false, error: "Có lỗi xảy ra khi đổi mật khẩu" }
    }
}
