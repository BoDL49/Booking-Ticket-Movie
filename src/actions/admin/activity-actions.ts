"use server"

import { db } from "@/lib/db"

export async function getRecentActivities(limit = 10) {
    try {
        const recentBookings = await db.booking.findMany({
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                showtime: {
                    select: {
                        movie: {
                            select: {
                                title: true
                            }
                        }
                    }
                }
            }
        })

        return {
            success: true,
            activities: recentBookings.map((booking: any) => ({
                id: booking.id,
                type: 'BOOKING',
                userName: booking.user.name || booking.user.email,
                movieTitle: booking.showtime.movie.title,
                status: booking.status,
                totalPrice: booking.totalPrice,
                createdAt: booking.createdAt
            }))
        }
    } catch (error) {
        console.error("Error fetching recent activities:", error)
        return {
            success: false,
            activities: []
        }
    }
}
