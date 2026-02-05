"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift, Zap, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

const PROMOS = [
    {
        id: 1,
        title: "Ưu đãi Bơ Member",
        desc: "Đồng giá 79K cho tất cả các suất chiếu 2D vào thứ 4 hàng tuần.",
        color: "from-lime-600 to-green-600",
        icon: <Zap className="w-6 h-6" />
    },
    {
        id: 2,
        title: "Combo Siêu Tiết Kiệm",
        desc: "Giảm ngay 20% khi mua kèm bắp nước cùng vé phim bom tấn.",
        color: "from-blue-600 to-purple-600",
        icon: <Gift className="w-6 h-6" />
    },
    {
        id: 3,
        title: "Tích Điểm Đổi Quà",
        desc: "Mỗi giao dịch cộng ngay 5% điểm thưởng để đổi vé miễn phí.",
        color: "from-green-600 to-emerald-600",
        icon: <TrendingUp className="w-6 h-6" />
    }
]

export function PromotionSection() {
    return (
        <section className="py-20 bg-zinc-950">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white mb-2">Ưu đãi <span className="text-green-600">độc quyền</span></h2>
                        <p className="text-zinc-500">Dành riêng cho cộng đồng BơCinema</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PROMOS.map((promo) => (
                        <Card key={promo.id} className="bg-zinc-900/50 border-zinc-800 hover:border-green-500/30 transition-all group cursor-pointer overflow-hidden shadow-2xl">
                            <CardContent className="p-8 relative">
                                <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${promo.color} opacity-10 blur-2xl group-hover:opacity-30 transition-opacity`} />
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${promo.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                                    {promo.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-500 transition-colors uppercase italic">{promo.title}</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">{promo.desc}</p>

                                <div className="mt-8 flex items-center text-xs font-black text-zinc-500 group-hover:text-white transition-colors">
                                    <Link href="/member" className="flex items-center gap-1 w-full h-full">
                                        XEM CHI TIẾT <ArrowRight className="w-3 h-3 ml-1" />
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
