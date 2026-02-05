"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import fs from "fs/promises"
import path from "path"

const updateProfileSchema = z.object({
    name: z.string().min(1, "Vui lòng nhập họ tên"),
    // Image is handled separately as File
    phone: z.string().optional(),
    birthday: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
        message: "Ngày sinh không hợp lệ"
    })
})

export async function updateProfileAction(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) {
        return { success: false, error: "Bạn chưa đăng nhập" }
    }

    const imageFile = formData.get("image") as File | null
    const rawData = {
        name: formData.get("name"),
        phone: formData.get("phone"),
        birthday: formData.get("birthday")
    }

    const validatedFields = updateProfileSchema.safeParse(rawData)

    if (!validatedFields.success) {
        const errorMsg = Object.values(validatedFields.error.flatten().fieldErrors).flat()[0]
        return { success: false, error: errorMsg || "Dữ liệu không hợp lệ" }
    }

    const { name, phone, birthday } = validatedFields.data
    let imagePath = undefined

    // Handle File Upload
    if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
        try {
            // Create uploads directory if not exists
            const uploadDir = path.join(process.cwd(), "public", "uploads")
            await fs.mkdir(uploadDir, { recursive: true })

            const buffer = Buffer.from(await imageFile.arrayBuffer())
            // Sanitize filename safe
            const safeName = imageFile.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase()
            const fileName = `${Date.now()}-${safeName}`
            const filePath = path.join(uploadDir, fileName)

            await fs.writeFile(filePath, buffer)
            imagePath = `/uploads/${fileName}`
        } catch (e) {
            console.error("Upload failed", e)
            return { success: false, error: "Tải ảnh thất bại" }
        }
    }

    try {
        await db.user.update({
            where: { id: session.user.id },
            data: {
                name,
                ...(imagePath && { image: imagePath }), // Only update if new image uploaded
                phone: phone || null,
                birthday: birthday ? new Date(birthday) : null
            }
        })

        revalidatePath("/profile")
        return { success: true }
    } catch (error) {
        console.error("Profile update error:", error)
        return { success: false, error: "Có lỗi xảy ra khi cập nhật hồ sơ" }
    }
}
