"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

// 1. Get Halls
export async function getHalls() {
    try {
        const session = await auth()
        if (session?.user.role !== "ADMIN") {
            return { error: "Bạn không có quyền xem danh sách phòng chiếu" }
        }

        const halls = await db.cinemaHall.findMany({
            orderBy: { name: 'asc' },
            include: {
                cinema: { select: { name: true } },
                _count: {
                    select: { seats: true, showtimes: true }
                }
            }
        })
        return { halls }
    } catch (error) {
        return { error: "Không thể tải danh sách phòng chiếu" }
    }
}

// 2. Create Hall
export async function createHall(data: { name: string; totalSeats: number; cinemaId: string }) {
    try {
        const session = await auth()
        if (session?.user.role !== "ADMIN") {
            return { error: "Bạn không có quyền thực hiện thao tác này" }
        }

        // Create Hall and Auto-generate Seats (10 seats per row)
        // A1-A10, B1-B10, etc.
        const seatsData = []
        const seatsPerRow = 10
        const rows = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

        for (let i = 0; i < data.totalSeats; i++) {
            const rowIndex = Math.floor(i / seatsPerRow)
            const seatNumber = (i % seatsPerRow) + 1
            const rowLabel = rows[rowIndex] || `R${rowIndex + 1}`

            seatsData.push({
                row: rowLabel,
                number: seatNumber,
                type: "STANDARD" as const // Default type
            })
        }

        const hall = await db.cinemaHall.create({
            data: {
                name: data.name,
                totalSeats: data.totalSeats,
                cinemaId: data.cinemaId, // Link to Cinema
                seats: {
                    create: seatsData
                }
            }
        })

        revalidatePath("/admin/halls")
        return { success: "Đã tạo phòng chiếu thành công!", hall }
    } catch (error) {
        return { error: "Lỗi khi tạo phòng chiếu" }
    }
}

// 3. Update Hall
export async function updateHall(id: string, data: { name: string; cinemaId: string; totalSeats: number }) {
    try {
        const session = await auth()
        if (session?.user.role !== "ADMIN") {
            return { error: "Bạn không có quyền thực hiện thao tác này" }
        }

        await db.cinemaHall.update({
            where: { id },
            data: {
                name: data.name,
                cinemaId: data.cinemaId,
                totalSeats: data.totalSeats
            }
        })

        revalidatePath("/admin/halls")
        return { success: "Cập nhật phòng chiếu thành công!" }
    } catch (error) {
        return { error: "Lỗi khi cập nhật phòng chiếu" }
    }
}

// 4. Delete Hall
export async function deleteHall(id: string) {
    try {
        const session = await auth()
        if (session?.user.role !== "ADMIN") {
            return { error: "Bạn không có quyền thực hiện thao tác này" }
        }

        // Check for existing showtimes
        const hasShowtimes = await db.showtime.findFirst({
            where: { hallId: id }
        })

        if (hasShowtimes) {
            return { error: "Không thể xóa phòng chiếu đã có lịch chiếu." }
        }

        // Manually cascade delete seats first (since schema might not have onDelete: Cascade)
        await db.seat.deleteMany({
            where: { hallId: id }
        })

        await db.cinemaHall.delete({
            where: { id }
        })

        revalidatePath("/admin/halls")
        return { success: "Đã xóa phòng chiếu thành công!" }
    } catch (error) {
        console.error(error)
        return { error: "Không thể xóa phòng chiếu này (Lỗi dữ liệu liên quan)" }
    }
}
