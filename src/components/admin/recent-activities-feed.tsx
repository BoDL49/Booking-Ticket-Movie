"use client"

import { useEffect, useState } from "react"
import { Ticket, Clock } from "lucide-react"
import { getRecentActivities } from "@/actions/admin/activity-actions"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"

interface Activity {
    id: string
    type: string
    userName: string
    movieTitle: string
    status: string
    totalPrice: number
    createdAt: Date
}

export function RecentActivitiesFeed() {
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)

    const fetchActivities = async () => {
        const res = await getRecentActivities(5)
        if (res.success) {
            setActivities(res.activities)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchActivities()
        // Refresh every 10 seconds
        const interval = setInterval(fetchActivities, 10000)
        return () => clearInterval(interval)
    }, [])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return 'text-green-500'
            case 'PENDING':
                return 'text-yellow-500'
            case 'CANCELLED':
                return 'text-red-500'
            default:
                return 'text-zinc-500'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return 'Đã thanh toán'
            case 'PENDING':
                return 'Chờ thanh toán'
            case 'CANCELLED':
                return 'Đã hủy'
            default:
                return status
        }
    }

    if (loading) {
        return (
            <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-8 space-y-6">
                <h4 className="text-white font-black italic uppercase tracking-tighter text-xl mb-4">Hoạt động gần đây</h4>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 animate-pulse">
                            <div className="w-10 h-10 rounded-full bg-zinc-800" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                                <div className="h-3 bg-zinc-800 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-8 space-y-6">
            <h4 className="text-white font-black italic uppercase tracking-tighter text-xl mb-4">Hoạt động gần đây</h4>

            {activities.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm italic">Chưa có hoạt động nào</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 group cursor-pointer hover:bg-zinc-800/30 p-3 rounded-xl transition-all">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-green-500 group-hover:border-green-500/30 transition-colors shrink-0">
                                <Ticket className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-zinc-100 italic truncate">
                                    {activity.userName} • {activity.movieTitle}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-xs font-bold ${getStatusColor(activity.status)}`}>
                                        {getStatusText(activity.status)}
                                    </span>
                                    <span className="text-zinc-600">•</span>
                                    <span className="text-xs text-zinc-500">
                                        {activity.totalPrice.toLocaleString('vi-VN')} đ
                                    </span>
                                </div>
                                <p className="text-[10px] text-zinc-600 uppercase font-black mt-1">
                                    {formatDistanceToNow(new Date(activity.createdAt), {
                                        addSuffix: true,
                                        locale: vi
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
