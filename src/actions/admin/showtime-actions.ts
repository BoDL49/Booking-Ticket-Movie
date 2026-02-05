"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function getShowtimes() {
    try {
        const showtimes = await db.showtime.findMany({
            include: {
                movie: true,
                hall: true
            },
            orderBy: {
                startTime: 'desc'
            }
        })
        return { showtimes }
    } catch (error) {
        return { error: "Không thể tải danh sách suất chiếu" }
    }
}

export async function getMoviesAndHalls() {
    try {
        const [movies, halls] = await Promise.all([
            db.movie.findMany({
                where: {
                    status: {
                        in: ["NOW_SHOWING", "COMING_SOON"]
                    }
                },
                orderBy: { title: 'asc' },
                select: { id: true, title: true, duration: true }
            }),
            db.cinemaHall.findMany({
                orderBy: { name: 'asc' },
                select: { id: true, name: true }
            })
        ])
        return { movies, halls }
    } catch (error) {
        return { error: "Không thể tải dữ liệu" }
    }
}

export async function createShowtime(data: any) {
    try {
        const session = await auth()
        if (session?.user.role !== "ADMIN") {
            return { error: "Bạn không có quyền thực hiện thao tác này" }
        }

        // Validate overlap? For now, just create.
        const showtime = await db.showtime.create({
            data: {
                movieId: data.movieId,
                hallId: data.hallId,
                startTime: new Date(data.startTime),
                format: data.format,
                language: data.language,
                basePrice: Number(data.basePrice),
            }
        })

        revalidatePath("/admin/showtimes")
        return { success: "Đã tạo suất chiếu thành công!", showtime }
    } catch (error: any) {
        console.error("CREATE_SHOWTIME_ERROR:", error)
        return { error: "Lỗi khi tạo suất chiếu" }
    }
}

export async function deleteShowtime(id: string) {
    try {
        const session = await auth()
        if (session?.user.role !== "ADMIN") {
            return { error: "Bạn không có quyền thực hiện thao tác này" }
        }

        await db.showtime.delete({
            where: { id }
        })

        revalidatePath("/admin/showtimes")
        return { success: "Đã xóa suất chiếu thành công!" }
    } catch (error) {
        return { error: "Không thể xóa suất chiếu này (có thể đã có vé đặt)" }
    }
}
