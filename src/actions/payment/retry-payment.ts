"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { payos } from "@/lib/payos"

export type RetryPaymentState = {
    success?: boolean
    error?: string
    checkoutUrl?: string
}

export async function retryPayment(
    bookingId: string,
    paymentMethod: 'payos' | 'vnpay' | 'paypal' = 'payos'
): Promise<RetryPaymentState> {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
        return { error: "Bạn cần đăng nhập để thực hiện thao tác này!" }
    }

    try {
        const booking = await db.booking.findUnique({
            where: { id: bookingId },
            include: {
                showtime: {
                    include: {
                        movie: true
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

        if (!booking) {
            return { error: "Không tìm thấy thông tin vé!" }
        }

        if (booking.userId !== userId) {
            return { error: "Bạn không có quyền thực hiện thao tác này!" }
        }

        if (booking.status !== 'PENDING') {
            return { error: "Vé này không ở trạng thái chờ thanh toán!" }
        }

        // Check 30-minute expiration
        const now = new Date()
        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000)

        if (booking.createdAt < thirtyMinutesAgo) {
            return { error: "Vé đã hết hạn thanh toán (quá 30 phút). Vui lòng đặt vé mới!" }
        }

        let checkoutUrl: string

        if (paymentMethod === 'vnpay') {
            // VNPay Payment
            const { vnpay } = await import('@/lib/vnpay')

            // @ts-ignore
            if (!booking.showtime) throw new Error("Missing showtime data")

            checkoutUrl = vnpay.createPaymentUrl({
                amount: booking.totalPrice,
                orderInfo: `BoCinema Booking ${booking.id.slice(0, 8)}`,
                orderType: 'billpayment',
                txnRef: booking.id, // Re-use booking ID
                ipAddr: '127.0.0.1'
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
                        value: (booking.totalPrice / 25000).toFixed(2) // Approximate conversion for Sandbox
                    },
                    description: `BoCinema Booking #${booking.id.slice(0, 8)}`
                }],
                application_context: {
                    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/paypal/capture?bookingId=${booking.id}`,
                    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tickets/${booking.id}?status=cancelled`
                }
            })

            const order = await paypalClient().execute(request)
            checkoutUrl = order.result.links.find((link: any) => link.rel === 'approve').href
        } else {
            // PayOS Payment
            // Generate new orderCode to avoid duplication error if previous attempt failed but created order
            const orderCode = Number(String(Date.now()).slice(-6) + Math.floor(Math.random() * 1000))

            const seats = booking.items.filter(i => i.seat)
            const products = booking.items.filter(i => i.product)

            const paymentData = {
                orderCode: orderCode,
                amount: booking.totalPrice,
                description: `BơCinema #${booking.id.slice(0, 4)}`,
                items: [
                    ...seats.map(item => ({
                        name: "Ghế xem phim",
                        quantity: 1,
                        price: item.price
                    })),
                    ...products.map(item => ({
                        name: item.product?.name || "Bắp nước",
                        quantity: item.quantity,
                        price: item.price
                    })),
                ],
                returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/tickets/${booking.id}?status=success`,
                cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/tickets/${booking.id}?status=cancelled`, // Redirect back to tickets page on cancel
            }

            const paymentLink = await payos.paymentRequests.create(paymentData)
            checkoutUrl = paymentLink.checkoutUrl
        }

        return { success: true, checkoutUrl }

    } catch (error) {
        console.error("Retry payment failed:", error)
        return { error: "Đã có lỗi xảy ra khi tạo lại link thanh toán." }
    }
}
