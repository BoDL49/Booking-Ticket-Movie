import { NextRequest, NextResponse } from 'next/server'
import { vnpay, VNPay } from '@/lib/vnpay'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const query: any = {}

        // Convert URLSearchParams to object
        searchParams.forEach((value, key) => {
            query[key] = value
        })

        // Verify signature
        const { isValid, responseCode } = vnpay.verifyReturnUrl(query)

        if (!isValid) {
            return NextResponse.redirect(
                new URL(`/tickets?status=error&message=${encodeURIComponent('Chữ ký không hợp lệ')}`, request.url)
            )
        }

        const txnRef = query.vnp_TxnRef // This is our booking ID
        const amount = parseInt(query.vnp_Amount) / 100 // Convert back from VNPay format

        // Update booking status based on response code
        if (responseCode === '00') {
            // Payment successful
            // Transaction: Update Booking + Add Loyalty Points
            await db.$transaction(async (tx) => {
                const booking = await tx.booking.findUnique({
                    where: { id: txnRef }
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
                            where: { id: txnRef },
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

            return NextResponse.redirect(
                new URL(`/tickets/${txnRef}?status=success`, request.url)
            )
        } else {
            // Payment failed or cancelled
            const errorMessage = VNPay.getResponseMessage(responseCode || '99')

            return NextResponse.redirect(
                new URL(`/tickets/${txnRef}?status=failed&message=${encodeURIComponent(errorMessage)}`, request.url)
            )
        }
    } catch (error) {
        console.error('VNPay callback error:', error)
        return NextResponse.redirect(
            new URL(`/tickets?status=error&message=${encodeURIComponent('Đã có lỗi xảy ra')}`, request.url)
        )
    }
}
