import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Crown, Gift, Ticket, Zap } from "lucide-react"

export default function MemberPage() {
    return (
        <div className="min-h-screen bg-black text-zinc-100 pt-24 pb-20">
            <div className="container mx-auto px-4">
                {/* Hero */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white mb-6">
                        Đặc Quyền <span className="text-green-600">Bơ Member</span>
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Trở thành thành viên của BơCinema để tận hưởng vô vàn ưu đãi độc quyền. Tích điểm đổi quà, vé miễn phí, và nhiều hơn thế nữa.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden group hover:border-green-600/50 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap className="w-24 h-24 text-green-600" />
                        </div>
                        <div className="w-12 h-12 bg-green-600/20 text-green-500 rounded-2xl flex items-center justify-center mb-6">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Tích Điểm Mọi Giao Dịch</h3>
                        <p className="text-zinc-400">
                            Nhận ngay <span className="text-white font-bold">5%</span> giá trị giao dịch vào tài khoản điểm thưởng. Dùng điểm để đổi vé hoặc bắp nước miễn phí.
                        </p>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden group hover:border-blue-600/50 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Gift className="w-24 h-24 text-blue-600" />
                        </div>
                        <div className="w-12 h-12 bg-blue-600/20 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                            <Gift className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Quà Tặng Sinh Nhật</h3>
                        <p className="text-zinc-400">
                            Tặng ngay <span className="text-white font-bold">1 Vé 2D + 1 Combo Bắp Nước</span> trong tháng sinh nhật của bạn. Áp dụng cho thành viên VIP trở lên.
                        </p>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden group hover:border-yellow-600/50 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Crown className="w-24 h-24 text-yellow-600" />
                        </div>
                        <div className="w-12 h-12 bg-yellow-600/20 text-yellow-500 rounded-2xl flex items-center justify-center mb-6">
                            <Crown className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Ưu Đãi Thành Viên VIP</h3>
                        <p className="text-zinc-400">
                            Nhân đôi điểm tích lũy, lối đi riêng (Fast Lane), và tham gia các suất chiếu sớm đặc biệt (Sneak Show).
                        </p>
                    </div>
                </div>

                {/* Tiers Section */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12">
                    <h2 className="text-3xl font-black text-white mb-12 text-center uppercase">Hạng Thành Viên</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Member */}
                        <div className="text-center">
                            <div className="h-40 flex items-center justify-center mb-6">
                                <div className="w-32 h-32 rounded-full border-4 border-zinc-700 bg-zinc-800 flex items-center justify-center">
                                    <span className="text-2xl font-black text-zinc-500">MEMBER</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Bơ Member</h3>
                            <p className="text-sm text-zinc-500 mb-6">Khi vừa đăng ký</p>
                            <ul className="text-zinc-400 text-sm space-y-2">
                                <li>Tích lũy 5% điểm thưởng</li>
                                <li>Giảm 10% vé ngày Member Day (Thứ 4)</li>
                            </ul>
                        </div>

                        {/* VIP */}
                        <div className="text-center transform scale-105">
                            <div className="h-40 flex items-center justify-center mb-6 relative">
                                <div className="absolute -top-6">
                                    <Crown className="w-8 h-8 text-yellow-500 animate-bounce" />
                                </div>
                                <div className="w-32 h-32 rounded-full border-4 border-yellow-500 bg-zinc-800 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                                    <span className="text-2xl font-black text-yellow-500">VIP</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-yellow-500 mb-2">Bơ VIP</h3>
                            <p className="text-sm text-zinc-500 mb-6">Tích lũy &gt; 1,000 điểm</p>
                            <ul className="text-zinc-300 text-sm space-y-2 font-medium">
                                <li>Tích lũy 7% điểm thưởng</li>
                                <li>Quà tặng sinh nhật (Vé + Bắp nước)</li>
                                <li>Ưu đãi vé suất sớm</li>
                            </ul>
                        </div>

                        {/* V.VIP */}
                        <div className="text-center">
                            <div className="h-40 flex items-center justify-center mb-6">
                                <div className="w-32 h-32 rounded-full border-4 border-green-600 bg-zinc-800 flex items-center justify-center shadow-[0_0_20px_rgba(22,163,74,0.2)]">
                                    <span className="text-2xl font-black text-green-600">V.VIP</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-green-600 mb-2">Bơ V.VIP</h3>
                            <p className="text-sm text-zinc-500 mb-6">Tích lũy &gt; 5,000 điểm</p>
                            <ul className="text-zinc-400 text-sm space-y-2">
                                <li>Tích lũy 10% điểm thưởng</li>
                                <li>Tặng vé xem phim hàng tháng</li>
                                <li>Lối đi ưu tiên & Hotline riêng</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 font-bold px-10 h-14 text-lg rounded-full shadow-2xl shadow-green-900/40">
                        <Link href="/register">Đăng Ký Ngay</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
