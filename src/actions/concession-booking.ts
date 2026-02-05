"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { payos } from "@/lib/payos"

export type ConcessionBookingState = {
    success?: boolean
    error?: string
    bookingId?: string
    checkoutUrl?: string
}

export async function createConcessionBooking(
    products: { id: string; name: string; quantity: number; price: number }[],
    totalPrice: number
): Promise<ConcessionBookingState> {
    const session = await auth()

    const userId = session?.user?.id
    if (!userId) {
        return { error: "Bạn cần đăng nhập để mua bắp nước!" }
    }

    if (!products || products.length === 0) {
        return { error: "Vui lòng chọn ít nhất một sản phẩm." }
    }

    try {
        const { booking, checkoutUrl } = await db.$transaction(async (tx: any) => {
            // 1. Create Booking
            const newBooking = await tx.booking.create({
                data: {
                    userId,
                    showtimeId: null, // No movie
                    totalPrice,
                    status: 'PENDING',
                    items: {
                        create: products.map(p => ({
                            productId: p.id,
                            quantity: p.quantity,
                            price: p.price
                        }))
                    }
                }
            })

            // 2. Create PayOS Link
            const orderCode = Number(String(Date.now()).slice(-6) + Math.floor(Math.random() * 1000))

            const paymentData = {
                orderCode: orderCode,
                amount: totalPrice,
                description: `VibeSnacks #${newBooking.id.slice(0, 4)}`,
                items: products.map(p => ({
                    name: p.name,
                    quantity: p.quantity,
                    price: p.price
                })),
                returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/tickets?bookingId=${newBooking.id}&status=success`,
                cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/concessions?status=cancelled`,
            };

            const paymentLink = await payos.paymentRequests.create(paymentData);

            return { booking: newBooking, checkoutUrl: paymentLink.checkoutUrl }
        })

        return { success: true, bookingId: booking.id, checkoutUrl }

    } catch (error) {
        console.error("Concession booking failed:", error)
        return { error: "Đã có lỗi xảy ra. Vui lòng thử lại." }
    }
}
