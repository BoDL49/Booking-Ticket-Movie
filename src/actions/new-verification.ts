"use server"

import { db } from "@/lib/db"

export const newVerification = async (token: string) => {
    const existingToken = await db.verificationToken.findUnique({
        where: { token }
    })

    if (!existingToken) {
        return { error: "Mã xác thực không tồn tại!" }
    }

    const hasExpired = new Date(existingToken.expires) < new Date()

    if (hasExpired) {
        return { error: "Mã xác thực đã hết hạn!" }
    }

    const existingUser = await db.user.findFirst({
        where: { email: existingToken.email }
    })

    if (!existingUser) {
        return { error: "Email không tồn tại!" }
    }

    await db.user.update({
        where: { id: existingUser.id },
        data: {
            emailVerified: new Date(),
            email: existingToken.email, // In case email change flow is added later
        }
    })

    await db.verificationToken.delete({
        where: { id: existingToken.id }
    })

    return { success: "Xác thực email thành công!" }
}
