import { getAllProducts } from "@/lib/data-service"
import { db } from "@/lib/db"
import { Popcorn, Utensils, Zap, Sparkles } from "lucide-react"
import { ConcessionsClient } from "@/components/concessions/concessions-client"

export default async function ConcessionsPage() {
    const [products, categories] = await Promise.all([
        getAllProducts(),
        db.productCategory.findMany({
            orderBy: { name: 'asc' }
        })
    ])

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20">
            {/* Hero Section */}
            <div className="relative h-[40vh] w-full mb-16 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&q=80&w=1600"
                        className="w-full h-full object-cover opacity-30 grayscale blur-sm"
                        alt="Cinema snacks background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                </div>

                <div className="relative z-10 text-center space-y-4 max-w-2xl px-4 text-white">
                    <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-orange-500/30">
                        <Sparkles className="w-3 h-3" /> Exclusive Menu
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase">
                        Bơ <span className="text-orange-500">Snacks</span>
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Nâng tầm trải nghiệm điện ảnh với bộ sưu tập bắp nước thượng hạng. Miễn phí nâng size cho hội viên Gold.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {/* Grid - Interactive Client Component */}
                <ConcessionsClient products={products} categories={categories} />

                {/* Info Section */}
                <div className="mt-24 p-12 bg-zinc-900 border border-zinc-800 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Utensils className="w-64 h-64 text-white" />
                    </div>
                    <div className="relative z-10 max-w-xl">
                        <h2 className="text-3xl font-bold mb-4">Lưu ý khi đặt bắp nước</h2>
                        <ul className="space-y-3 text-zinc-400">
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 shrink-0" />
                                <span className="text-zinc-400">Bạn có thể mua bắp nước lẻ hoặc mua kèm trong quá trình đặt vé phim.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 shrink-0" />
                                <span className="text-zinc-400">Vui lòng mang mã QR code đến quầy Concession để nhận sản phẩm.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 shrink-0" />
                                <span className="text-zinc-400">Điểm tích lũy BơPoints sẽ được cộng ngay sau khi thanh toán thành công.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
