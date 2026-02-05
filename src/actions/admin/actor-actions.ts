"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createActor(data: { name: string, bio?: string, avatarUrl?: string }) {
    try {
        const actor = await db.person.create({
            data: {
                name: data.name,
                bio: data.bio,
                avatarUrl: data.avatarUrl || null,
            }
        })

        revalidatePath("/admin/actors")
        revalidatePath("/")
        return { success: "Đã thêm diễn viên thành công!", actor }
    } catch (error: any) {
        console.error("CREATE_ACTOR_ERROR:", error)
        return { error: "Lỗi khi thêm diễn viên" }
    }
}

export async function updateActor(id: string, data: { name: string, bio?: string, avatarUrl?: string }) {
    try {
        const actor = await db.person.update({
            where: { id },
            data: {
                name: data.name,
                bio: data.bio,
                avatarUrl: data.avatarUrl || null,
            }
        })

        revalidatePath("/admin/actors")
        revalidatePath("/")
        return { success: "Cập nhật thông tin diễn viên thành công!", actor }
    } catch (error: any) {
        console.error("UPDATE_ACTOR_ERROR:", error)
        return { error: "Lỗi khi cập nhật diễn viên" }
    }
}

export async function deleteActor(id: string) {
    try {
        await db.person.delete({
            where: { id }
        })

        revalidatePath("/admin/actors")
        revalidatePath("/")
        return { success: "Đã xóa diễn viên thành công!" }
    } catch (error: any) {
        console.error("DELETE_ACTOR_ERROR:", error)
        return { error: "Lỗi khi xóa diễn viên. Có thể diễn viên này đang liên kết với một bộ phim." }
    }
}
