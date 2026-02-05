import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, XCircle, Home, Calendar, Clock, MapPin, Ticket as TicketIcon, Popcorn } from "lucide-react"

// Force dynamic to handle searchParams
export const dynamic = 'force-dynamic'

interface TicketsPageProps {
    searchParams: {
        bookingId?: string
        status?: string
        cancel?: string
    }
}

export default async function TicketsPage({ searchParams }: TicketsPageProps) {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const { bookingId, status, cancel } = await searchParams; // Await searchParams in Next 15

    if (!bookingId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Không tìm thấy vé</h1>
                    <Button asChild><Link href="/">Về trang chủ</Link></Button>
                </div>
            </div>
        )
    }

    const booking = await db.booking.findUnique({
        where: { id: bookingId },
        include: {
            showtime: {
                include: {
                    movie: true,
                    hall: true
                }
            },
            items: true
        }
    })

    if (!booking) return <div>Đơn hàng không tồn tại.</div>

    // Handle PayOS Return Status
    // In real app, verify with PayOS API here using booking.orderCode (if stored)
    // For now, trust the URL status or just show as is.
    // If status=success, we assume it's paid. 

    // UPDATE Booking Status if coming from success URL and still PENDING
    if (status === 'success' && booking.status === 'PENDING') {
        await db.booking.update({
            where: { id: bookingId },
            data: { status: 'CONFIRMED' } // or PAID
        })
        booking.status = 'CONFIRMED'
    } else if (cancel === 'true' || status === 'cancelled') {
        // Maybe mark as cancelled logic?
    }

    const isSuccess = booking.status === 'CONFIRMED'
    const isCancelled = booking.status === 'CANCELLED'

    return (
        <div className="min-h-screen pt-24 pb-12 bg-zinc-950 px-4">
            <div className="container mx-auto max-w-md">
                <Card className={`border-2 ${isSuccess ? 'border-green-500/50' : 'border-red-500/50'} bg-zinc-900`}>
                    <CardHeader className="text-center pb-2">
                        <div className="flex justify-center mb-4">
                            {isSuccess ? (
                                <CheckCircle2 className="w-16 h-16 text-green-500" />
                            ) : (
                                <XCircle className="w-16 h-16 text-red-500" />
                            )}
                        </div>
                        <CardTitle className="text-2xl text-white">
                            {isSuccess ? "Đặt Vé Thành Công!" : "Thanh Toán Thất Bại"}
                        </CardTitle>
                        <p className="text-zinc-400">
                            {isSuccess ? "Vé của bạn đã được xuất hệ thống." : "Vui lòng thử lại hoặc liên hệ hỗ trợ."}
                        </p>
                    </CardHeader>

                    {isSuccess && (
                        <CardContent className="space-y-6">
                            {/* Booking Content */}
                            {booking.showtime ? (
                                <>
                                    {/* Movie Info */}
                                    <div className="flex gap-4 items-start">
                                        <img
                                            src={booking.showtime.movie.posterUrl || "/placeholder.jpg"}
                                            className="w-20 h-28 object-cover rounded-md"
                                        />
                                        <div>
                                            <h3 className="font-bold text-lg text-white mb-1">{booking.showtime.movie.title}</h3>
                                            <div className="flex items-center text-sm text-zinc-400 gap-2 mb-1">
                                                <span className="bg-red-600 text-white text-[10px] px-1 rounded">2D</span>
                                                <span>{booking.showtime.movie.duration} phút</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-zinc-800" />

                                    {/* Ticket Details */}
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-zinc-500 flex items-center gap-2"><MapPin className="w-4 h-4" /> Rạp</span>
                                            <span className="text-white font-medium">{booking.showtime.hall.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Ngày</span>
                                            <span className="text-white font-medium">
                                                {new Date(booking.showtime.startTime).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-500 flex items-center gap-2"><Clock className="w-4 h-4" /> Giờ</span>
                                            <span className="text-white font-bold text-red-500">
                                                {new Date(booking.showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-500 flex items-center gap-2"><TicketIcon className="w-4 h-4" /> Ghế</span>
                                            <span className="text-white font-bold">
                                                {booking.items.filter((i: any) => i.seatId).map((i: any) => i.seatId).join(", ")}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Concession Only Info */}
                                    <div className="flex flex-col items-center py-4 text-center">
                                        <Popcorn className="w-12 h-12 text-yellow-500 mb-3" />
                                        <h3 className="font-bold text-xl text-white">Đơn hàng Bắp Nước</h3>
                                        <p className="text-zinc-400 text-sm italic">Sẵn sàng để nhận tại quầy</p>
                                    </div>
                                    <div className="h-px bg-zinc-800" />
                                    <div className="space-y-3 text-sm">
                                        {booking.items.filter((i: any) => i.productId).map((item: any) => (
                                            <div key={item.id} className="flex justify-between">
                                                <span className="text-zinc-500">{item.quantity}x {item.product?.name || "Sản phẩm"}</span>
                                                <span className="text-white font-medium">{item.price.toLocaleString('vi-VN')} đ</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            <div className="h-px bg-zinc-800" />

                            {/* QR Code Placeholder */}
                            <div className="bg-white p-4 rounded-lg flex justify-center">
                                {/* Use an img API for QR mostly */}
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.id}`}
                                    alt="Ticket QR"
                                    className="w-32 h-32"
                                />
                            </div>
                            <p className="text-center text-xs text-zinc-500">
                                Mã đặt vé: <span className="font-mono text-zinc-300">{booking.id.slice(-8).toUpperCase()}</span>
                            </p>
                        </CardContent>
                    )}

                    <CardFooter className="flex flex-col gap-3">
                        <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                            <Link href="/">Về Trang Chủ</Link>
                        </Button>
                        <Button variant="ghost" className="w-full text-zinc-400 hover:text-white">
                            <Link href="/profile">Xem Lịch Sử Đặt Vé</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
