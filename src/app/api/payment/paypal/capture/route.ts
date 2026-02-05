import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const bookingId = searchParams.get('bookingId')
    const token = searchParams.get('token') // PayPal Order ID

    if (!bookingId || !token) {
        return Response.json({ error: "Missing parameters" }, { status: 400 })
    }

    let redirectPath = ''

    try {
        const paypalClient = (await import('@/lib/paypal')).default
        // @ts-ignore
        const paypalSdk = (await import('@paypal/checkout-server-sdk')).default

        const request = new paypalSdk.orders.OrdersCaptureRequest(token)
        request.requestBody({})

        const capture = await paypalClient().execute(request)

        if (capture.result.status === 'COMPLETED') {
            // Transaction: Update Booking + Add Loyola Points
            await db.$transaction(async (tx) => {
                const booking = await tx.booking.findUnique({
                    where: { id: bookingId }
                })

                if (booking && booking.status === 'PENDING') {
                    // Calculate total spent for Rank
                    const spendingAgg = await tx.booking.aggregate({
                        _sum: { totalPrice: true },
                        where: {
                            userId: booking.userId,
                            status: 'CONFIRMED'
                        }
                    })
                    const totalSpent = spendingAgg._sum.totalPrice || 0

                    if (true) {
                        const { calculatePoints } = await import('@/lib/loyalty')
                        const { points } = calculatePoints(booking.totalPrice, totalSpent)

                        await tx.booking.update({
                            where: { id: bookingId },
                            data: { status: 'CONFIRMED' }
                        })

                        await tx.user.update({
                            where: { id: booking.userId },
                            data: {
                                loyaltyPoints: { increment: points }
                            }
                        })
                    }
                }
            })

            redirectPath = `/tickets/${bookingId}?status=success`
        } else {
            redirectPath = `/tickets/${bookingId}?status=failed&error=CaptureFailed`
        }

    } catch (error) {
        console.error("PayPal Capture Error:", error)
        redirectPath = `/tickets/${bookingId}?status=failed&error=ServerError`
    }

    if (redirectPath) {
        redirect(redirectPath)
    }
}
