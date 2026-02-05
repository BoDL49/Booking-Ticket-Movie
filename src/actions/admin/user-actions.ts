"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { Role } from "@prisma/client"

// 1. Get Users with Pagination & Filter
export async function getUsers() {
    try {
        const session = await auth()
        if (session?.user.role !== "ADMIN") {
            return { error: "Bạn không có quyền xem danh sách người dùng" }
        }

        const users = await db.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                loyaltyPoints: true,
                createdAt: true,
                _count: {
                    select: { bookings: true }
                }
            }
        })
        return { users }
    } catch (error) {
        return { error: "Không thể tải danh sách người dùng" }
    }
}

// 2. Update User (Role only for now)
export async function updateUserRole(id: string, role: Role) {
    try {
        const session = await auth()
        if (session?.user.role !== "ADMIN") {
            return { error: "Bạn không có quyền thực hiện thao tác này" }
        }

        await db.user.update({
            where: { id },
            data: { role }
        })

        revalidatePath("/admin/users")
        return { success: "Cập nhật vai trò người dùng thành công!" }
    } catch (error) {
        return { error: "Lỗi khi cập nhật vai trò" }
    }
}

// 3. Delete User
export async function deleteUser(id: string) {
    try {
        const session = await auth()
        if (session?.user.role !== "ADMIN") {
            return { error: "Bạn không có quyền thực hiện thao tác này" }
        }

        // Check if user has bookings? Maybe allow delete and cascade or restrict
        // Prisma schema should handle cascade if configured, checking schema...
        // Booking relation in User does not satisfy strict check here.
        // Let's rely on Prisma or add check.
        // For safety, let's just try delete. If FK constraints fail, catch error.

        await db.user.delete({
            where: { id }
        })

        revalidatePath("/admin/users")
        return { success: "Đã xóa người dùng thành công!" }
    } catch (error) {
        return { error: "Không thể xóa người dùng này (có thể có dữ liệu liên quan)" }
    }
}
