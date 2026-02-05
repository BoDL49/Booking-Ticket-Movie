"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { BookingStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

// 1. Get Bookings
export async function getBookings() {
    try {
        const session = await auth()
        if (session?.user.role !== "ADMIN") {
            return { error: "Bạn không có quyền xem danh sách đơn hàng" }
        }

        const bookings = await db.booking.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, email: true, image: true }
                },
                showtime: {
                    include: {
                        movie: { select: { title: true, posterUrl: true } },
                        hall: { select: { name: true } }
                    }
                },
                items: {
                    include: {
                        seat: true,
                        product: true
                    }
                }
            }
        })
        return { bookings }
    } catch (error) {
        return { error: "Không thể tải danh sách đơn hàng" }
    }
}

// 2. Update Booking Status (e.g. Cancel or Confirm manually)
export async function updateBookingStatus(id: string, status: BookingStatus) {
    try {
        const session = await auth()
        if (session?.user.role !== "ADMIN") {
            return { error: "Bạn không có quyền thực hiện thao tác này" }
        }

        await db.booking.update({
            where: { id },
            data: { status }
        })

        revalidatePath("/admin/bookings")
        return { success: "Cập nhật trạng thái đơn hàng thành công!" }
    } catch (error) {
        return { error: "Lỗi khi cập nhật trạng thái" }
    }
}
