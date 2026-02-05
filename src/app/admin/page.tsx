import { db } from "@/lib/db"
import {
    LayoutDashboard,
    TrendingUp,
    Ticket,
    Popcorn,
    Film,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react"
import { AdminStatsOverview } from "@/components/admin/admin-stats-overview"
import { RecentActivitiesFeed } from "@/components/admin/recent-activities-feed"

export default async function AdminDashboardPage() {
    return (
        <div className="space-y-10">
            {/* Welcome Header */}
            <div>
                <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white mb-2">
                    Bảng <span className="text-green-600">Điều Khiển</span>
                </h1>
                <p className="text-zinc-500 italic">Chào mừng quay trở lại. BơCinema đang có hoạt động sôi nổi hôm nay.</p>
            </div>

            {/* Real-time Stats Grid */}
            <AdminStatsOverview />

            {/* Placeholder for Revenue Chart / Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-zinc-900/50 border border-white/5 rounded-[2rem] p-8 h-80 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute top-8 left-8">
                        <h4 className="text-white font-black italic uppercase tracking-tighter text-xl">Thống kê doanh thu</h4>
                        <p className="text-zinc-500 text-xs">Phân tích theo tuần hiện tại</p>
                    </div>
                    <div className="w-full h-32 bg-gradient-to-t from-green-600/10 to-transparent absolute bottom-0" />
                    <p className="text-zinc-700 font-black italic uppercase tracking-widest text-sm opacity-50">Biểu đồ đang phát triển...</p>
                </div>

                <RecentActivitiesFeed />
            </div>
        </div>
    )
}
