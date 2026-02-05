"use client"

import { useState, useTransition } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Search,
    Ticket,
    Calendar,
    MapPin,
    Clock,
    Eye,
    CheckCircle2,
    XCircle,
    Loader2
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { updateBookingStatus } from "@/actions/admin/booking-actions"
import QRCode from "react-qr-code"
// import { $Enums } from "@prisma/client"

interface Booking {
    id: string
    totalPrice: number
    status: "CONFIRMED" | "PENDING" | "CANCELLED"
    createdAt: Date
    user: {
        name: string | null
        email: string
        image: string | null
    }
    showtime?: {
        startTime: Date
        movie: {
            title: string
            posterUrl: string | null
        }
        hall: {
            name: string
        }
    } | null
    items: any[]
}

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [isPending, startTransition] = useTransition()

    // Filter Logic
    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = (booking.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.id.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesStatus = statusFilter === "ALL" || booking.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const handleStatusUpdate = (id: string, newStatus: "CONFIRMED" | "PENDING" | "CANCELLED") => {
        startTransition(async () => {
            const result = await updateBookingStatus(id, newStatus)
            if (result.success) {
                toast.success(result.success)
                setSelectedBooking(prev => prev ? { ...prev, status: newStatus } : null)
            } else {
                toast.error(result.error)
            }
        })
    }

    const getStatusBadge = (status: "CONFIRMED" | "PENDING" | "CANCELLED") => {
        switch (status) {
            case "CONFIRMED":
                return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0">Đã thanh toán</Badge>
            case "PENDING":
                return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-0">Chờ thanh toán</Badge>
            case "CANCELLED":
                return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-0">Đã hủy</Badge>
            default:
                return <Badge variant="outline">Không rõ</Badge>
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6 bg-zinc-950/30 p-4 rounded-2xl border border-white/5">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-green-500 transition-colors" />
                    <Input
                        placeholder="Tìm ID, tên khách hoặc email..."
                        className="pl-10 bg-zinc-900 border-zinc-800 focus:ring-green-500/20 focus:border-green-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[200px] bg-zinc-900 border-zinc-800">
                            <SelectValue placeholder="Lọc theo trạng thái" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                            <SelectItem value="CONFIRMED">Đã thanh toán</SelectItem>
                            <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
                            <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] overflow-hidden shadow-xl">
                <Table>
                    <TableHeader className="bg-zinc-950/50">
                        <TableRow className="border-white/5 hover:bg-transparent">
                            <TableHead className="font-bold text-zinc-400 pl-6">Mã đơn</TableHead>
                            <TableHead className="font-bold text-zinc-400">Khách hàng</TableHead>
                            <TableHead className="font-bold text-zinc-400">Phim & Suất chiếu</TableHead>
                            <TableHead className="font-bold text-zinc-400">Tổng tiền</TableHead>
                            <TableHead className="font-bold text-zinc-400">Trạng thái</TableHead>
                            <TableHead className="font-bold text-zinc-400 text-right pr-6">Chi tiết</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-zinc-500 font-bold italic">
                                    Không tìm thấy đơn hàng nào based on filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredBookings.map((booking) => (
                                <TableRow key={booking.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                    <TableCell className="pl-6 font-mono text-xs text-zinc-500">
                                        #{booking.id.slice(-6).toUpperCase()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white text-sm">{booking.user.name || "Khách vãng lai"}</span>
                                            <span className="text-xs text-zinc-500">{booking.user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {booking.showtime ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-12 bg-zinc-800 rounded overflow-hidden shrink-0">
                                                    {booking.showtime.movie.posterUrl && <img src={booking.showtime.movie.posterUrl} className="w-full h-full object-cover" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-white text-sm line-clamp-1">{booking.showtime.movie.title}</span>
                                                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                        <span>{booking.showtime.hall.name}</span>
                                                        <span>•</span>
                                                        <span>{new Date(booking.showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-zinc-500 italic">Suất chiếu đã bị xóa</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-black text-green-500">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalPrice)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(booking.status)}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-zinc-500 hover:text-white"
                                                    onClick={() => setSelectedBooking(booking)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl font-black italic uppercase">Chi tiết đơn hàng</DialogTitle>
                                                </DialogHeader>
                                                {selectedBooking && (
                                                    <div className="space-y-6">
                                                        <div className="flex justify-between items-start bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                                            <div className="flex gap-4">
                                                                {/* QR Code for Admin */}
                                                                {(selectedBooking.status === "CONFIRMED" || selectedBooking.status === "PAID" as any) && (
                                                                    <div className="bg-white p-2 rounded-lg shrink-0">
                                                                        <QRCode
                                                                            value={selectedBooking.id}
                                                                            size={64}
                                                                            level={'M'}
                                                                        />
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Mã đơn hàng</p>
                                                                    <p className="font-mono text-lg font-bold">{selectedBooking.id}</p>
                                                                    <p className="text-zinc-500 text-xs mt-1">
                                                                        {new Date(selectedBooking.createdAt).toLocaleDateString('vi-VN', {
                                                                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                                        })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                {getStatusBadge(selectedBooking.status)}
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Thông tin phim</p>
                                                                {selectedBooking.showtime ? (
                                                                    <div className="flex gap-3">
                                                                        <div className="w-16 h-24 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                                                                            {selectedBooking.showtime.movie.posterUrl && <img src={selectedBooking.showtime.movie.posterUrl} className="w-full h-full object-cover" />}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-bold text-white">{selectedBooking.showtime.movie.title}</p>
                                                                            <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1">
                                                                                <MapPin className="w-3 h-3" /> {selectedBooking.showtime.hall.name}
                                                                            </div>
                                                                            <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1">
                                                                                <Calendar className="w-3 h-3" /> {new Date(selectedBooking.showtime.startTime).toLocaleDateString('vi-VN')}
                                                                            </div>
                                                                            <div className="flex items-center gap-2 text-sm text-green-500 font-bold mt-1">
                                                                                <Clock className="w-3 h-3" /> {new Date(selectedBooking.showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-zinc-500 italic">Thông tin suất chiếu không khả dụng</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Chi tiết ghế & dịch vụ</p>
                                                                <div className="space-y-2">
                                                                    {selectedBooking.items.filter((i: any) => i.seat).map((item: any, idx: number) => (
                                                                        <div key={idx} className="flex justify-between items-center bg-zinc-900 p-2 rounded text-sm">
                                                                            <span className="flex items-center gap-2">
                                                                                <Ticket className="w-3 h-3 text-green-500" />
                                                                                Ghế {item.seat.row}{item.seat.number} ({item.seat.type})
                                                                            </span>
                                                                            <span className="font-bold">{new Intl.NumberFormat('vi-VN').format(item.price)}đ</span>
                                                                        </div>
                                                                    ))}
                                                                    {selectedBooking.items.filter((i: any) => i.product).map((item: any, idx: number) => (
                                                                        <div key={idx} className="flex justify-between items-center bg-zinc-900 p-2 rounded text-sm">
                                                                            <span className="flex items-center gap-2">
                                                                                <span className="font-bold text-xs bg-zinc-800 px-1 rounded">x{item.quantity}</span>
                                                                                {item.product.name}
                                                                            </span>
                                                                            <span className="font-bold">{new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                                                                    <span className="font-bold text-white">Tổng cộng</span>
                                                                    <span className="font-black text-xl text-green-500">
                                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedBooking.totalPrice)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        {selectedBooking.status === "PENDING" && (
                                                            <div className="flex gap-4 pt-4 border-t border-white/5">
                                                                <Button
                                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold"
                                                                    onClick={() => handleStatusUpdate(selectedBooking.id, "CONFIRMED")}
                                                                    disabled={isPending}
                                                                >
                                                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4 mr-2" /> Xác nhận thanh toán</>}
                                                                </Button>
                                                                <Button
                                                                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold"
                                                                    onClick={() => handleStatusUpdate(selectedBooking.id, "CANCELLED")}
                                                                    disabled={isPending}
                                                                >
                                                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><XCircle className="w-4 h-4 mr-2" /> Hủy đơn hàng</>}
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
