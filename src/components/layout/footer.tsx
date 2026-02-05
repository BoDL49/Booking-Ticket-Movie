import Link from "next/link"
import { Film, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-zinc-950 border-t border-white/5 pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/logo.png" alt="BơCinema" className="h-8 w-8 object-contain" />
                            <span className="text-2xl font-bold tracking-tighter text-white">
                                Bơ<span className="text-green-500">Cinema</span>
                            </span>
                        </Link>
                        <p className="text-zinc-500 leading-relaxed text-sm">
                            Trải nghiệm điện ảnh đỉnh cao với hệ thống âm thanh, ánh sáng hiện đại nhất. Đặt vé nhanh chóng, dễ dàng cùng BơCinema.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-green-600 hover:text-white transition-all"><Facebook className="h-5 w-5" /></Link>
                            <Link href="#" className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-green-600 hover:text-white transition-all"><Instagram className="h-5 w-5" /></Link>
                            <Link href="#" className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-green-600 hover:text-white transition-all"><Twitter className="h-5 w-5" /></Link>
                            <Link href="#" className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-green-600 hover:text-white transition-all"><Youtube className="h-5 w-5" /></Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Khám phá</h4>
                        <ul className="space-y-4">
                            <li><Link href="/movies?status=NOW_SHOWING" className="text-zinc-500 hover:text-green-500 transition-colors text-sm">Phim đang chiếu</Link></li>
                            <li><Link href="/movies?status=COMING_SOON" className="text-zinc-500 hover:text-green-500 transition-colors text-sm">Phim sắp chiếu</Link></li>
                            <li><Link href="/cinemas" className="text-zinc-500 hover:text-green-500 transition-colors text-sm">Rạp toàn quốc</Link></li>
                            <li><Link href="/concessions" className="text-zinc-500 hover:text-green-500 transition-colors text-sm">Bắp nước & Combo</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Hỗ trợ</h4>
                        <ul className="space-y-4">
                            <li><Link href="/faq" className="text-zinc-500 hover:text-green-500 transition-colors text-sm">Câu hỏi thường gặp</Link></li>
                            <li><Link href="/terms" className="text-zinc-500 hover:text-green-500 transition-colors text-sm">Điều khoản sử dụng</Link></li>
                            <li><Link href="/privacy" className="text-zinc-500 hover:text-green-500 transition-colors text-sm">Chính sách bảo mật</Link></li>
                            <li><Link href="/support" className="text-zinc-500 hover:text-green-500 transition-colors text-sm">Chăm sóc khách hàng</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Liên hệ</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm">
                                <MapPin className="h-5 w-5 text-green-600 shrink-0" />
                                <span className="text-zinc-500">Số 123, Đường Cine, Quận Blockbuster, TP. Hồ Chí Minh</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Phone className="h-5 w-5 text-green-600 shrink-0" />
                                <span className="text-zinc-500">1900 8888</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Mail className="h-5 w-5 text-green-600 shrink-0" />
                                <span className="text-zinc-500">support@bocinema.vn</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-zinc-600 text-xs">
                        © 2026 BơCinema. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <img src="https://static-znews.pstatic.net/images/payos-logo.png" alt="PayOS" className="h-4 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                        <span className="text-[10px] text-zinc-700 bg-white/5 px-2 py-1 rounded">Mã số thuế: 0123456789</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
