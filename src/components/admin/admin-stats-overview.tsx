"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Ticket, Film, Popcorn, ArrowUpRight, ArrowDownRight, Users } from "lucide-react"
import { getAdminStats } from "@/actions/admin/stats-actions"
import { toast } from "sonner"

export function AdminStatsOverview() {
    const [stats, setStats] = useState({
        revenue: 0,
        bookings: 0,
        movies: 0,
        products: 0,
        users: 0
    })
    const [loading, setLoading] = useState(true)

    const fetchStats = async () => {
        const res = await getAdminStats()
        if (res.success && res.totalRevenue !== undefined) {
            setStats({
                revenue: res.totalRevenue,
                bookings: res.bookingCount || 0,
                movies: res.movieCount || 0,
                products: res.productCount || 0,
                users: res.totalUsers || 0
            })
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchStats()
        // Poll every 5 seconds
        const interval = setInterval(fetchStats, 5000)
        return () => clearInterval(interval)
    }, [])

    const STATS_DATA = [
        {
            label: "Doanh thu tổng",
            value: `${stats.revenue.toLocaleString('vi-VN')} đ`,
            icon: <TrendingUp className="text-green-500" />,
            trend: "+12.5%",
            isUp: true
        },
        {
            label: "Vé đã bán",
            value: stats.bookings,
            icon: <Ticket className="text-blue-500" />,
            trend: "+8.2%",
            isUp: true
        },
        {
            label: "Phim đang chiếu",
            value: stats.movies,
            icon: <Film className="text-green-500" />,
            trend: "-2.1%",
            isUp: false
        },
        {
            label: "Khách hàng",
            value: stats.users,
            icon: <Users className="text-purple-500" />,
            trend: "+5.4%",
            isUp: true
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS_DATA.map((stat, i) => (
                <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-green-500/20 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        {stat.icon}
                    </div>
                    <div className="space-y-4">
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                        <h3 className={`text-3xl font-black italic tracking-tighter text-white ${loading ? 'opacity-50 blur-sm' : ''}`}>
                            {stat.value}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className={`flex items-center text-xs font-bold ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                {stat.trend}
                            </span>
                            <span className="text-[10px] text-zinc-600 font-bold uppercase italic">so với tháng trước</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
