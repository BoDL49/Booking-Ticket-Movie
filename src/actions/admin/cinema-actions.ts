"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function createCinema(data: any) {
    try {
        const session = await auth()
        if (session?.user?.role !== "ADMIN") {
            return { error: "Bạn không có quyền thực hiện thao tác này." }
        }

        const cinema = await db.cinema.create({
            data: {
                name: data.name,
                address: data.address,
                imageUrl: data.imageUrl || null
            }
        })

        revalidatePath("/admin/cinemas")
        revalidatePath("/cinemas")
        return { success: "Đã thêm chi nhánh mới!", cinema }
    } catch (error: any) {
        console.error("CREATE_CINEMA_ERROR:", error)
        return { error: "Lỗi khi tạo chi nhánh mới." }
    }
}

export async function updateCinema(id: string, data: any) {
    try {
        const session = await auth()
        if (session?.user?.role !== "ADMIN") {
            return { error: "Bạn không có quyền thực hiện thao tác này." }
        }

        const cinema = await db.cinema.update({
            where: { id },
            data: {
                name: data.name,
                address: data.address,
                imageUrl: data.imageUrl || null
            }
        })

        revalidatePath("/admin/cinemas")
        revalidatePath("/cinemas")
        return { success: "Cập nhật thông tin chi nhánh thành công!", cinema }
    } catch (error: any) {
        console.error("UPDATE_CINEMA_ERROR:", error)
        return { error: "Lỗi khi cập nhật chi nhánh." }
    }
}

export async function deleteCinema(id: string) {
    try {
        const session = await auth()
        if (session?.user?.role !== "ADMIN") {
            return { error: "Bạn không có quyền thực hiện thao tác này." }
        }

        // Check if cinema has halls/showtimes?
        // For simplicity, we might let cascade handle it or restrict deletion if data exists.
        // Assuming cascade isn't set up thoroughly for safety, check manually.

        await db.cinema.delete({
            where: { id }
        })

        revalidatePath("/admin/cinemas")
        revalidatePath("/cinemas")
        return { success: "Đã xóa chi nhánh thành công!" }
    } catch (error: any) {
        console.error("DELETE_CINEMA_ERROR:", error)
        return { error: "Không thể xóa chi nhánh (Có thể đang có phòng chiếu/lịch chiếu)." }
    }
}

export async function getCinemas() {
    try {
        const cinemas = await db.cinema.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { halls: true }
                }
            }
        })
        return { cinemas }
    } catch (error) {
        return { error: "Failed to fetch cinemas" }
    }
}
