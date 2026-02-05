"use server"

import { db } from "@/lib/db"

export async function getAdminStats() {
    try {
        const [
            movieCount,
            bookingCount,
            productCount,
            bookings,
            totalUsers
        ] = await Promise.all([
            db.movie.count({
                where: {
                    status: 'NOW_SHOWING'
                }
            }),
            db.booking.count({
                where: {
                    status: { not: 'CANCELLED' }
                }
            }),
            db.product.count({
                where: {
                    isAvailable: true
                }
            }),
            db.booking.findMany({
                where: { status: 'CONFIRMED' },
                select: { totalPrice: true, createdAt: true }
            }),
            db.user.count()
        ])

        const totalRevenue = bookings.reduce((acc: number, b) => acc + b.totalPrice, 0)

        // Mock trends for now (could be calculated based on previous month)
        return {
            totalRevenue,
            bookingCount,
            movieCount,
            productCount,
            totalUsers,
            success: true
        }
    } catch (error) {
        console.error("Error fetching stats:", error)
        return {
            success: false,
            error: "Failed to fetch stats",
            totalRevenue: 0,
            bookingCount: 0,
            movieCount: 0,
            productCount: 0,
            totalUsers: 0
        }
    }
}
