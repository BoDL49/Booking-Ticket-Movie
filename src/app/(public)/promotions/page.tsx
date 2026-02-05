"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Ticket, Star } from "lucide-react"
import Link from "next/link"

// Mock Data for Promotions
const PROMOTIONS = [
    {
        id: 1,
        title: "Thứ 3 Vui Vẻ - Happy Tuesday",
        description: "Đồng giá vé 50k cho tất cả các suất chiếu và mọi loại ghế (trừ ghế VIP/Couple) vào ngày Thứ 3 hàng tuần.",
        image: "https://images.unsplash.com/photo-1517604931442-71053e6e2319?auto=format&fit=crop&q=80&w=800&h=450",
        code: "HAPPYTUE",
        type: "Weekly",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20"
    },
    {
        id: 2,
        title: "U22 - Học Sinh Sinh Viên",
        description: "Giảm 20% giá vé cho thành viên U22 (dưới 22 tuổi). Áp dụng từ Thứ 2 đến Thứ 6 trước 17:00.",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800&h=450",
        code: "U22STUDENT",
        type: "Member",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20"
    },
    {
        id: 3,
        title: "Combo Bắp Nước Khổng Lồ",
        description: "Mua 2 vé bất kỳ tặng ngay voucher giảm 30% cho Combo Solo hoặc Couple. Thỏa sức ăn uống.",
        image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&q=80&w=800&h=450",
        code: "BIGCOMBO",
        type: "Concession",
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20"
    },
    {
        id: 4,
        title: "Thành Viên Mới - Quà Phơi Phới",
        description: "Đăng ký thành viên mới nhận ngay 1 vé xem phim 2D miễn phí (HSD: 30 ngày).",
        image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=800&h=450",
        code: "NEWMEMBER",
        type: "New User",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20"
    }
]

export default function PromotionsPage() {
    return (
        <div className="min-h-screen bg-black text-zinc-100 font-sans pt-24 pb-20">
            {/* Hero Section */}
            <div className="container mx-auto px-4 mb-16">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
                        Ưu Đãi <span className="text-green-500">Đặc Biệt</span>
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Săn vé giá rẻ, combo bắp nước thả ga cùng hàng ngàn ưu đãi hấp dẫn dành riêng cho thành viên BơCinema.
                    </p>
                </div>
            </div>

            {/* Promotions Grid */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {PROMOTIONS.map((promo) => (
                        <div key={promo.id} className={`group relative bg-zinc-900/50 border ${promo.borderColor} rounded-3xl overflow-hidden hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl`}>
                            <div className="flex flex-col md:flex-row h-full">
                                {/* Image Info */}
                                <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                                    <img
                                        src={promo.image}
                                        alt={promo.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60 md:hidden" />
                                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-white uppercase tracking-wider">
                                        {promo.type}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-8 flex flex-col justify-between space-y-6">
                                    <div className="space-y-3">
                                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tight leading-none group-hover:text-green-500 transition-colors">
                                            {promo.title}
                                        </h2>
                                        <p className="text-zinc-400 text-sm leading-relaxed">
                                            {promo.description}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className={`flex items-center gap-3 p-3 rounded-xl border border-dashed ${promo.borderColor} ${promo.bgColor}`}>
                                            <Ticket className={`w-5 h-5 ${promo.color}`} />
                                            <div className="flex-1">
                                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Mã khuyến mãi</p>
                                                <p className={`font-mono text-lg font-black ${promo.color}`}>{promo.code}</p>
                                            </div>
                                            <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-white" onClick={() => {/* Copy Logic */ }}>
                                                Copy
                                            </Button>
                                        </div>

                                        <Button className="w-full bg-white text-black hover:bg-zinc-200 font-bold rounded-xl h-12 shadow-lg hover:shadow-white/20" asChild>
                                            <Link href="/movies">
                                                Dùng Ngay
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Membership Call to Action */}
                <div className="mt-20 bg-gradient-to-r from-green-900/20 to-zinc-900/50 border border-green-500/20 rounded-3xl p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 mix-blend-overlay" />
                    <div className="relative z-10 space-y-6">
                        <Star className="w-16 h-16 text-yellow-500 mx-auto fill-yellow-500 animate-pulse" />
                        <h2 className="text-3xl font-black italic uppercase text-white">
                            Trờ thành <span className="text-green-500">Cư Dân BơCinema</span>
                        </h2>
                        <p className="text-zinc-400 max-w-xl mx-auto">
                            Tích điểm đổi quà, nhận vé miễn phí sinh nhật và hàng ngàn ưu đãi độc quyền dành cho thành viên thân thiết.
                        </p>
                        <div className="flex gap-4 justify-center pt-4">
                            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-full px-8 shadow-lg shadow-green-900/20">
                                Đăng Ký Ngay
                            </Button>
                            <Button size="lg" variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-full px-8">
                                Xem Quyền Lợi
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
