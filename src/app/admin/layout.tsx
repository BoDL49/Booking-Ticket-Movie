"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
    LayoutDashboard,
    Film,
    Calendar,
    Popcorn,
    Users,
    Ticket,
    Settings,
    ChevronRight,
    LogOut,
    MapPin,
    Building2,
    Tags
} from "lucide-react"

const SIDEBAR_LINKS = [
    { label: "Tổng quan", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { label: "Quản lý Slider", href: "/admin/sliders", icon: <LayoutDashboard size={20} className="rotate-180" /> },
    { label: "Quản lý phim", href: "/admin/movies", icon: <Film size={20} /> },
    { label: "Thể loại", href: "/admin/genres", icon: <Tags size={20} /> },
    { label: "Chi nhánh", href: "/admin/cinemas", icon: <Building2 size={20} /> },
    { label: "Suất chiếu", href: "/admin/showtimes", icon: <Calendar size={20} /> },
    { label: "Phòng chiếu", href: "/admin/halls", icon: <MapPin size={20} /> },
    { label: "Diễn viên", href: "/admin/actors", icon: <Users size={20} /> },
    { label: "Bắp nước", href: "/admin/concessions", icon: <Popcorn size={20} /> },
    { label: "Khách hàng", href: "/admin/users", icon: <Users size={20} /> },
    { label: "Vé đã đặt", href: "/admin/bookings", icon: <Ticket size={20} /> },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="flex min-h-screen bg-zinc-950 text-white selection:bg-green-600/30">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-black p-6 flex flex-col fixed inset-y-0 z-50">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="bg-green-600 p-2 rounded-xl shadow-[0_0_20px_rgba(22,163,74,0.3)]">
                        <img src="/logo.png" alt="BơCinema" className="h-6 w-6 object-contain" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">
                            Bơ<span className="text-green-600">Admin</span>
                        </h1>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Management Suite</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {SIDEBAR_LINKS.map((link) => {
                        const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href))
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center justify-between p-3 rounded-xl transition-all group ${isActive
                                    ? "bg-green-600 text-white shadow-lg shadow-green-900/20"
                                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <div className="flex items-center gap-3 font-bold text-sm">
                                    <span className={isActive ? "text-white" : "text-zinc-400 group-hover:text-green-500 transition-colors"}>
                                        {link.icon}
                                    </span>
                                    {link.label}
                                </div>
                                {isActive && <ChevronRight size={16} />}
                            </Link>
                        )
                    })}
                </nav>

                <div className="pt-6 border-t border-white/5 space-y-2">
                    <Link href="/" className="flex items-center gap-3 p-3 text-zinc-500 hover:text-white transition-colors text-sm font-bold">
                        <LayoutDashboard size={20} /> Quay lại trang chủ
                    </Link>


                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-bold"
                    >
                        <LogOut size={20} /> Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900/20 via-zinc-950 to-zinc-950">
                {children}
            </main>
        </div>
    )
}
