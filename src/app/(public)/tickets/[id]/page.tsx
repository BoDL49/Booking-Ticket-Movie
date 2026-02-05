import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, XCircle, Calendar, Clock, MapPin, Ticket as TicketIcon, Popcorn } from "lucide-react"
import QRCode from "react-qr-code"

interface TicketDetailPageProps {
    params: {
        id: string
    }
    searchParams: {
        status?: string
        cancel?: string
        error?: string
    }
}

export default async function TicketDetailPage({ params, searchParams }: TicketDetailPageProps) {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const { id: bookingId } = await params
    const { status, cancel, error } = await searchParams

    const booking = await db.booking.findUnique({
        where: { id: bookingId },
        include: {
            showtime: {
                include: {
                    movie: true,
                    hall: {
                        include: {
                            cinema: true
                        }
                    }
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
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Không tìm thấy vé</h1>
                    <Button asChild><Link href="/">Về trang chủ</Link></Button>
                </div>
            </div>
        )
    }

    // Security check: only owner can view
    if (booking.userId.toString() !== session.user.id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
                <div className="text-center">
                    <h1 className="text-xl font-bold mb-4">Bạn không có quyền xem vé này</h1>
                    <Button asChild><Link href="/">Về trang chủ</Link></Button>
                </div>
            </div>
        )
    }

    // Handle PayOS/General Return Status
    // Note: status=success in URL is not a proof of payment in production. 
    // Ideally, rely on webhooks. This is for UI feedback only.
    if (status === 'success' && booking.status === 'PENDING') {
        await db.$transaction(async (tx) => {
            const freshBooking = await tx.booking.findUnique({ where: { id: bookingId } })
            if (freshBooking?.status === 'PENDING') {
                // Calculate total spent for Rank
                const spendingAgg = await tx.booking.aggregate({
                    _sum: { totalPrice: true },
                    where: {
                        userId: freshBooking.userId,
                        status: 'CONFIRMED'
                    }
                })
                const totalSpent = spendingAgg._sum.totalPrice || 0

                if (true) {
                    const { calculatePoints } = await import('@/lib/loyalty')
                    const { points } = calculatePoints(freshBooking.totalPrice, totalSpent)

                    await tx.booking.update({
                        where: { id: bookingId },
                        data: { status: 'CONFIRMED' }
                    })

                    await tx.user.update({
                        where: { id: freshBooking.userId },
                        data: {
                            loyaltyPoints: { increment: points }
                        }
                    })
                }
            }
        })
        // Refresh booking data for display
        booking.status = 'CONFIRMED'
    }

    const isSuccess = booking.status === 'CONFIRMED'
    const isCancelled = booking.status === 'CANCELLED' || status === 'cancelled' || cancel === 'true'
    const isPending = booking.status === 'PENDING'

    // If status=success passed but DB is PENDING, show a waiting state or optimistic success?
    // Let's show specific message.

    let headerTitle = "Chi Tiết Vé"
    let headerIcon = null
    let headerColor = "text-white"
    let borderColor = "border-zinc-800"

    if (isSuccess) {
        headerTitle = "Thanh Toán Thành Công!"
        headerIcon = <CheckCircle2 className="w-16 h-16 text-green-500" />
        headerColor = "text-green-500"
        borderColor = "border-green-500/50"
    } else if (isCancelled) {
        headerTitle = "Đã Hủy Thanh Toán"
        headerIcon = <XCircle className="w-16 h-16 text-red-500" />
        headerColor = "text-red-500"
        borderColor = "border-red-500/50"
    } else if (error) {
        headerTitle = "Thanh Toán Thất Bại"
        headerIcon = <XCircle className="w-16 h-16 text-red-500" />
        headerColor = "text-red-500"
        borderColor = "border-red-500/50"
    } else if (isPending) {
        headerTitle = "Chờ Thanh Toán"
        headerIcon = <Clock className="w-16 h-16 text-yellow-500" />
        headerColor = "text-yellow-500"
        borderColor = "border-yellow-500/50"
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-zinc-950 px-4">
            <div className="container mx-auto max-w-md">
                <Card className={`border-2 ${borderColor} bg-zinc-900 shadow-2xl overflow-hidden`}>
                    <CardHeader className="text-center pb-2 relative">
                        {/* Decorative background blur */}
                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-${isSuccess ? 'green' : 'red'}-500/20 blur-3xl opacity-50 z-0`} />

                        <div className="flex justify-center mb-4 relative z-10">
                            {headerIcon}
                        </div>
                        <CardTitle className={`text-2xl relative z-10 ${headerColor}`}>
                            {headerTitle}
                        </CardTitle>
                        {error && <p className="text-red-400 text-sm mt-2 relative z-10">Lỗi: {error}</p>}
                    </CardHeader>

                    <CardContent className="space-y-6 relative z-10">
                        {booking.showtime ? (
                            <>
                                {/* Movie Info */}
                                <div className="flex gap-4 items-start bg-zinc-950/50 p-3 rounded-lg border border-zinc-800">
                                    <img
                                        src={booking.showtime.movie.posterUrl || "/placeholder.jpg"}
                                        alt={booking.showtime.movie.title}
                                        className="w-20 h-28 object-cover rounded-md shadow-sm"
                                    />
                                    <div>
                                        <h3 className="font-bold text-lg text-white mb-1 line-clamp-2">{booking.showtime.movie.title}</h3>
                                        <div className="flex items-center text-sm text-zinc-400 gap-2 mb-1">
                                            <span className="bg-zinc-800 text-white text-[10px] px-1.5 py-0.5 rounded border border-zinc-700">2D</span>
                                            <span>{booking.showtime.movie.duration} phút</span>
                                        </div>
                                        <p className="text-xs text-zinc-500 mt-2">
                                            {booking.showtime.hall.cinema?.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="h-px bg-zinc-800" />

                                {/* Ticket Details */}
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-zinc-500 flex items-center gap-2"><MapPin className="w-4 h-4" /> Rạp / Phòng</span>
                                        <span className="text-white font-medium">{booking.showtime.hall.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-zinc-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Ngày chiếu</span>
                                        <span className="text-white font-medium">
                                            {new Date(booking.showtime.startTime).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-zinc-500 flex items-center gap-2"><Clock className="w-4 h-4" /> Giờ chiếu</span>
                                        <span className="text-white font-bold text-red-500 text-lg">
                                            {new Date(booking.showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-zinc-500 flex items-center gap-2 mt-1"><TicketIcon className="w-4 h-4" /> Ghế đã chọn</span>
                                        <span className="text-white font-bold text-right max-w-[60%]">
                                            {booking.items.filter((i: any) => i.seatId).map((i: any) => `${i.seat.row}${i.seat.number}`).join(", ")}
                                        </span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            // Concessions Only
                            <div className="flex flex-col items-center py-4 text-center">
                                <Popcorn className="w-12 h-12 text-yellow-500 mb-3" />
                                <h3 className="font-bold text-xl text-white">Đơn hàng Bắp Nước</h3>
                            </div>
                        )}

                        <div className="h-px bg-zinc-800" />

                        {/* Items List (Concessions) */}
                        {booking.items.some(i => i.productId) && (
                            <div className="space-y-2 text-sm bg-zinc-950/30 p-3 rounded-lg">
                                <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">Bắp nước & Combo</p>
                                {booking.items.filter((i: any) => i.productId).map((item: any) => (
                                    <div key={item.id} className="flex justify-between">
                                        <span className="text-zinc-400">{item.quantity}x {item.product?.name || "Sản phẩm"}</span>
                                        <span className="text-white font-medium">{item.price.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-2">
                            <span className="text-zinc-400 font-medium">Tổng tiền</span>
                            <span className="text-xl font-bold text-white">{booking.totalPrice.toLocaleString('vi-VN')} đ</span>
                        </div>

                        {/* QR Code */}
                        {isSuccess && (
                            <div className="flex flex-col items-center justify-center pt-4">
                                <div className="bg-white p-3 rounded-xl shadow-lg mb-2">
                                    <QRCode
                                        value={booking.id}
                                        size={120}
                                        level={'M'}
                                    />
                                </div>
                                <p className="text-xs text-zinc-500 flex flex-col items-center">
                                    <span>Mã đặt vé</span>
                                    <span className="font-mono text-white text-lg tracking-wider font-bold">
                                        {booking.id.slice(0, 8).toUpperCase()}
                                    </span>
                                </p>
                            </div>
                        )}

                        {!isSuccess && !isCancelled && !error && (
                            <div className="text-center text-sm text-yellow-500 bg-yellow-500/10 p-3 rounded-md border border-yellow-500/20">
                                Nếu bạn đã thanh toán, trạng thái sẽ được cập nhật trong ít phút.
                            </div>
                        )}

                    </CardContent>

                    <CardFooter className="flex flex-col gap-3 relative z-10">
                        {isPending && !isCancelled && (
                            <Button asChild className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold">
                                {/* Retry logic is client side modal, handled in Profile usually. 
                                   Here we could direct to profile or retry page if we had one.
                                   For now, link to Home */}
                                <Link href="/profile">Quản lý vé / Thanh toán lại</Link>
                            </Button>
                        )}
                        <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                            <Link href="/">Tiếp tục mua vé</Link>
                        </Button>
                        <Button variant="ghost" className="w-full text-zinc-400 hover:text-white" asChild>
                            <Link href="/profile">Xem Lịch Sử Đặt Vé</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
