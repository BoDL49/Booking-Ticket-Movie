import { getBookings } from "@/actions/admin/booking-actions"
import { BookingsTable } from "@/components/admin/bookings/bookings-table"
import { Ticket, Coins, Clock } from "lucide-react"

export default async function AdminBookingsPage() {
    const { bookings } = await getBookings()

    if (!bookings) {
        return <div className="text-white">Không tải được danh sách đơn hàng.</div>
    }

    // Stats
    const totalRevenue = bookings
        .filter((b: any) => b.status === 'CONFIRMED')
        .reduce((sum: number, b: any) => sum + b.totalPrice, 0)

    const pendingCount = bookings.filter((b: any) => b.status === 'PENDING').length

    return (
        <div className="space-y-8 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-[0.3em]">
                        <Ticket className="w-4 h-4" /> Transactions
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">
                        Quản lý <span className="text-red-600">Đặt Vé</span>
                    </h1>
                    <p className="text-zinc-500 max-w-md italic">
                        Theo dõi đơn hàng, doanh thu và trạng thái vé.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 rounded-xl">
                            <Ticket className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Tổng đơn hàng</p>
                            <p className="text-2xl font-black italic tracking-tighter text-white">{bookings.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/10 rounded-xl">
                            <Coins className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Doanh thu thực tế</p>
                            <p className="text-2xl font-black italic tracking-tighter text-white">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(totalRevenue)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Clock className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Đơn chờ xử lý</p>
                            <p className="text-2xl font-black italic tracking-tighter text-blue-500">{pendingCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <BookingsTable bookings={bookings as any} />
            </div>
        </div>
    )
}
