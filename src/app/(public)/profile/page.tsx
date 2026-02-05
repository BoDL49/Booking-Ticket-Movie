import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Crown } from "lucide-react"
import { ProfileForm } from "@/components/profile/profile-form"
import QRCode from "react-qr-code"
import { ChangePasswordForm } from "@/components/profile/change-password-form"
import { PaymentRetryButton } from "@/components/profile/payment-retry-button"

export default async function ProfilePage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    // Fetch full user data including phone, birthday, points
    const user = await db.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user) {
        redirect("/login")
    }

    const bookings = await db.booking.findMany({
        where: { userId: session.user.id },
        include: {
            showtime: {
                include: {
                    movie: true,
                    hall: true
                }
            },
            items: {
                include: {
                    seat: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="min-h-screen pt-24 pb-12 bg-zinc-950 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-2xl font-bold text-white shrink-0 overflow-hidden border border-zinc-700">
                            {user.image ? (
                                <img src={user.image} className="w-full h-full object-cover" alt="Avatar" />
                            ) : (
                                user.name?.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">{user.name}</h1>
                            <p className="text-zinc-400">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 px-6 flex flex-col items-center md:items-end w-48">
                            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Điểm tích lũy</span>
                            <div className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
                                {user.loyaltyPoints || 0} <span className="text-sm font-normal text-zinc-400">điểm</span>
                            </div>
                        </div>

                        {/* Membership Rank Badge */}
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-2 px-4 flex items-center gap-3 w-48 justify-center">
                            {(user.loyaltyPoints || 0) >= 5000 ? (
                                <div className="text-red-500 font-black flex items-center gap-2">
                                    <Crown className="w-5 h-5 fill-red-500" /> V.VIP
                                </div>
                            ) : (user.loyaltyPoints || 0) >= 1000 ? (
                                <div className="text-yellow-500 font-black flex items-center gap-2">
                                    <Crown className="w-5 h-5 fill-yellow-500" /> VIP
                                </div>
                            ) : (
                                <div className="text-zinc-400 font-bold flex items-center gap-2">
                                    <span className="bg-zinc-700 w-4 h-4 rounded-full inline-block" /> Member
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="tickets" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-zinc-900">
                        <TabsTrigger value="tickets">Vé Của Tôi</TabsTrigger>
                        <TabsTrigger value="settings">Cài Đặt Tài Khoản</TabsTrigger>
                    </TabsList>

                    <TabsContent value="tickets" className="mt-6 space-y-4">
                        <h2 className="text-xl font-semibold text-white mb-4">Lịch Sử Đặt Vé</h2>
                        {bookings.length === 0 ? (
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardContent className="pt-6 text-center text-zinc-400">
                                    Bạn chưa đặt vé nào.
                                </CardContent>
                            </Card>
                        ) : (
                            bookings.map((booking: any) => (
                                <Card key={booking.id} className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Movie Poster (Left) */}
                                        <div className="w-full md:w-32 h-32 relative shrink-0">
                                            <img
                                                src={booking.showtime.movie.posterUrl || "/placeholder.jpg"}
                                                className="w-full h-full object-cover"
                                                alt={booking.showtime.movie.title}
                                            />
                                        </div>

                                        {/* Content (Right) */}
                                        <div className="flex-1 p-4 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-lg text-white">{booking.showtime.movie.title}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1">
                                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {booking.showtime.hall.name}</span>
                                                        <span className="text-zinc-600">|</span>
                                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(booking.showtime.startTime).toLocaleDateString('vi-VN')}</span>
                                                        <span className="text-zinc-600">|</span>
                                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(booking.showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {booking.status === 'PENDING' && (
                                                        <PaymentRetryButton
                                                            bookingId={booking.id}
                                                            createdAt={booking.createdAt}
                                                        />
                                                    )}
                                                    <Badge className={
                                                        booking.status === 'CONFIRMED' || booking.status === 'PAID' ? "bg-green-600" :
                                                            booking.status === 'PENDING' ? "bg-yellow-600" : "bg-red-600"
                                                    }>
                                                        {booking.status === 'CONFIRMED' || booking.status === 'PAID' ? 'Đã Thanh Toán' :
                                                            booking.status === 'PENDING' ? 'Chờ Thanh Toán' : 'Đã Hủy'}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex justify-between items-end">
                                                <div className="text-sm text-zinc-300">
                                                    <span className="font-bold text-white">Ghế: </span>
                                                    {booking.items.filter((i: any) => i.seat).map((i: any) => i.seat.row + i.seat.number).join(", ")}
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="font-bold text-red-500 text-lg">
                                                        {booking.totalPrice.toLocaleString('vi-VN')} đ
                                                    </div>
                                                    {/* QR Code for Paid/Confirmed bookings */}
                                                    {(booking.status === 'CONFIRMED' || booking.status === 'PAID') && (
                                                        <div className="bg-white p-2 rounded-lg mt-2">
                                                            <QRCode
                                                                value={booking.id} // or a specific verification code
                                                                size={64}
                                                                level={'M'}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </TabsContent>

                    <TabsContent value="settings" className="mt-6 space-y-6">
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-white">Thông Tin Cá Nhân</CardTitle>
                                <CardDescription>Cập nhật thông tin tài khoản của bạn</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ProfileForm user={user} />
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-white">Bảo Mật & Mật Khẩu</CardTitle>
                                <CardDescription>Quản lý mật khẩu và bảo mật tài khoản</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChangePasswordForm />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
