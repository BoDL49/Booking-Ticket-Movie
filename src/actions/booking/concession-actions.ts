'use server'

import { db } from "@/lib/db"

export async function getActiveConcessions() {
    try {
        const concessions = await db.product.findMany({
            where: {
                isAvailable: true
            },
            include: {
                category: true
            },
            orderBy: {
                category: {
                    name: 'desc' // Group Combos first usually, or by category name
                }
            }
        })
        return { success: true, data: concessions }
    } catch (error) {
        console.error("Error fetching concessions:", error)
        return { error: "Không thể tải danh sách bắp nước." }
    }
}
