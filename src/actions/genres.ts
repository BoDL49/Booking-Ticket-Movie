"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const genreSchema = z.object({
    name: z.string().min(1, "Tên thể loại không được để trống"),
    slug: z.string().min(1, "Slug không được để trống"),
})

export async function createGenre(formData: FormData) {
    const name = formData.get("name") as string
    const slug = formData.get("slug") as string

    const validation = genreSchema.safeParse({ name, slug })

    if (!validation.success) {
        return { error: "Dữ liệu không hợp lệ" }
    }

    try {
        await db.genre.create({
            data: {
                name,
                slug,
            },
        })
        revalidatePath("/admin/genres")
        return { success: "Thêm thể loại thành công" }
    } catch (error) {
        return { error: "Lỗi khi thêm thể loại (có thể do trùng tên hoặc slug)" }
    }
}

export async function updateGenre(id: string, formData: FormData) {
    const name = formData.get("name") as string
    const slug = formData.get("slug") as string

    const validation = genreSchema.safeParse({ name, slug })

    if (!validation.success) {
        return { error: "Dữ liệu không hợp lệ" }
    }

    try {
        await db.genre.update({
            where: { id },
            data: {
                name,
                slug,
            },
        })
        revalidatePath("/admin/genres")
        return { success: "Cập nhật thể loại thành công" }
    } catch (error) {
        return { error: "Lỗi khi cập nhật thể loại" }
    }
}

export async function deleteGenre(id: string) {
    try {
        await db.genre.delete({
            where: { id },
        })
        revalidatePath("/admin/genres")
        return { success: "Xóa thể loại thành công" }
    } catch (error) {
        return { error: "Lỗi khi xóa thể loại" }
    }
}
