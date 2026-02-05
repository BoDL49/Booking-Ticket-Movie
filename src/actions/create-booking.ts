"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { payos } from "@/lib/payos"

export type CreateBookingState = {
    success?: boolean
    error?: string
    bookingId?: string
    checkoutUrl?: string
}

export async function createBooking(
    showtimeId: string,
    seatIds: string[],
    products: { id: string; quantity: number; price: number }[],
    totalPrice: number,
    paymentMethod: 'payos' | 'vnpay' | 'paypal' = 'payos'
): Promise<CreateBookingState> {
    const session = await auth()

    // 1. Auth Check
    // 1. Auth Check
    const userId = session?.user?.id
    if (!userId) {
        return { error: "Bạn cần đăng nhập để đặt vé!" }
    }

    if (!showtimeId || seatIds.length === 0) {
        return { error: "Dữ liệu đặt vé không hợp lệ." }
    }

    try {
        // 2. Verify User Exists in Database
        const user = await db.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return { error: "Tài khoản không tồn tại. Vui lòng đăng nhập lại!" }
        }

        // 2 check showtime
        const showtime = await db.showtime.findUnique({
            where: { id: showtimeId },
            select: { startTime: true }
        })

        if (!showtime) {
            return { error: "Suất chiếu không tồn tại!" }
        }

        const now = new Date()
        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000)
        const showtimeLimit = new Date(showtime.startTime.getTime() + 30 * 60 * 1000)

        // Rule 1: Cannot book if showtime started > 30 mins ago
        if (now > showtimeLimit) {
            return { error: "Suất chiếu đã bắt đầu quá 30 phút, không thể đặt vé!" }
        }

        // 3. Concurrency Check: Are seats still available?
        // Seats are taken if:
        // - Booking is CONFIRMED
        // - Booking is PENDING and created within the last 30 minutes (hold time)
        const existingBookings = await db.booking.findMany({
            where: {
                showtimeId,
                items: {
                    some: {
                        seatId: { in: seatIds }
                    }
                },
                OR: [
                    { status: 'CONFIRMED' },
                    {
                        status: 'PENDING',
                        createdAt: { gt: thirtyMinutesAgo }
                    }
                ]
            }
        })

        if (existingBookings.length > 0) {
            return { error: "Một trong các ghế bạn chọn đang được giữ hoặc đã bán. Vui lòng chọn ghế khác!" }
        }

        // 4. Create Booking Transaction
        const { booking, checkoutUrl } = await db.$transaction(async (tx: any) => {
            // Get showtime to calculate seat price
            const showtime = await tx.showtime.findUnique({
                where: { id: showtimeId },
                select: {
                    basePrice: true,
                    movie: {
                        select: { title: true }
                    }
                }
            })

            if (!showtime) {
                throw new Error("Suất chiếu không tồn tại!")
            }

            // Create the main booking record
            const newBooking = await tx.booking.create({
                data: {
                    userId,
                    showtimeId,
                    totalPrice,
                    status: 'PENDING', // Wait for payment
                    createdAt: new Date(),
                    // Create Seat Items and Product Items
                    items: {
                        create: [
                            // Seat items with showtime price
                            ...seatIds.map(seatId => ({
                                seatId,
                                price: showtime.basePrice,
                                quantity: 1
                            })),
                            // Product items with their prices
                            ...products.map(p => ({
                                productId: p.id,
                                price: p.price,
                                quantity: p.quantity
                            }))
                        ]
                    }
                }
            })

            // 5. Create Payment Link (PayOS or VNPay)
            let checkoutUrl: string

            if (paymentMethod === 'vnpay') {
                // VNPay Payment
                const { vnpay } = await import('@/lib/vnpay')
                const txnRef = newBooking.id // Use booking ID as transaction reference

                checkoutUrl = vnpay.createPaymentUrl({
                    amount: totalPrice,
                    orderInfo: `BoCinema Booking ${newBooking.id.slice(0, 8)}`,
                    orderType: 'billpayment',
                    txnRef: txnRef,
                    ipAddr: '127.0.0.1' // In production, get real IP from request
                })
            } else if (paymentMethod === 'paypal') {
                // PayPal Payment
                const paypalClient = (await import('@/lib/paypal')).default
                // @ts-ignore
                const paypalSdk = (await import('@paypal/checkout-server-sdk')).default

                const request = new paypalSdk.orders.OrdersCreateRequest()
                request.prefer("return=representation")
                request.requestBody({
                    intent: 'CAPTURE',
                    purchase_units: [{
                        amount: {
                            currency_code: 'USD',
                            value: (totalPrice / 25000).toFixed(2) // Approximate conversion for Sandbox
                        },
                        description: `BoCinema Booking #${newBooking.id.slice(0, 8)}`
                    }],
                    application_context: {
                        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/paypal/capture?bookingId=${newBooking.id}`,
                        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tickets/${newBooking.id}?status=cancelled`
                    }
                })

                const order = await paypalClient().execute(request)
                checkoutUrl = order.result.links.find((link: any) => link.rel === 'approve').href
            } else {
                // PayOS Payment
                const orderCode = Number(String(Date.now()).slice(-6) + Math.floor(Math.random() * 1000))

                const paymentData = {
                    orderCode: orderCode,
                    amount: totalPrice,
                    description: `BơCinema #${newBooking.id.slice(0, 4)}`,
                    items: [
                        ...seatIds.map(id => ({ name: "Ghế xem phim", quantity: 1, price: showtime.basePrice })),
                        ...products.map(p => ({ name: p.id, quantity: p.quantity, price: p.price })),
                    ],
                    returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/tickets/${newBooking.id}?status=success`,
                    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/tickets/${newBooking.id}?status=cancelled`,
                }

                const paymentLink = await payos.paymentRequests.create(paymentData)
                checkoutUrl = paymentLink.checkoutUrl
            }

            return { booking: newBooking, checkoutUrl }
        })

        return { success: true, bookingId: booking.id, checkoutUrl }

    } catch (error) {
        console.error("Booking failed:", error)
        return { error: "Đã có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại." }
    }
}
