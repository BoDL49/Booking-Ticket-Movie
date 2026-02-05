"use client"

import Link from "next/link"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Film, Menu, X, Ticket, Popcorn, User, LogOut, ShieldCheck } from "lucide-react"
import { useState, useEffect } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"

interface NavbarClientProps {
    user?: {
        name?: string | null
        email?: string | null
        image?: string | null
        role?: string | null
    }
}

export function NavbarClient({ user }: NavbarClientProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    // Update search query state when URL changes
    useEffect(() => {
        const query = searchParams.get("search")
        if (query) setSearchQuery(query)
    }, [searchParams])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/movies?search=${encodeURIComponent(searchQuery.trim())}`)
        } else {
            router.push(`/movies`)
        }
    }

    if (pathname.startsWith("/login") || pathname.startsWith("/register")) return null

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 mr-8">
                    <img src="/logo.png" alt="BơCinema" className="h-10 w-10 object-contain" />
                    <span className="text-2xl font-bold tracking-tighter text-white">
                        Bơ<span className="text-green-500">Cinema</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/movies" className="text-sm font-bold text-zinc-300 hover:text-white transition-colors uppercase">Phim</Link>
                    <Link href="/cinemas" className="text-sm font-bold text-zinc-300 hover:text-white transition-colors uppercase">Rạp</Link>
                    <Link href="/member" className="text-sm font-bold text-zinc-300 hover:text-white transition-colors uppercase">Hội viên</Link>
                    <Link href="/promotions" className="text-sm font-bold text-zinc-300 hover:text-white transition-colors uppercase">Khuyến mãi</Link>
                </div>

                {/* Search & Actions */}
                <div className="hidden md:flex items-center gap-4 ml-auto">

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="relative hidden lg:block">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                        <Input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm phim, rạp..."
                            className="w-64 bg-zinc-900/50 border-zinc-800 rounded-full pl-10 h-10 text-sm focus-visible:ring-green-500 text-zinc-200"
                        />
                    </form>

                    {/* Quick Actions */}
                    <Button asChild className="bg-green-600 hover:bg-green-700 rounded-full px-5 font-bold shadow-lg shadow-green-900/20 h-10 gap-2">
                        <Link href="/movies">
                            <Ticket className="h-4 w-4" />
                            <span>Đặt vé ngay</span>
                        </Link>
                    </Button>

                    <Button variant="outline" asChild className="border-orange-500/50 text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 rounded-full px-5 font-bold h-10 gap-2">
                        <Link href="/concessions">
                            <Popcorn className="h-4 w-4" />
                            <span>Đặt bắp nước</span>
                        </Link>
                    </Button>

                    <div className="h-6 w-px bg-white/10 mx-2" />

                    <div className="flex items-center gap-3">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button suppressHydrationWarning variant="ghost" className="flex items-center gap-3 px-2 py-1 h-auto hover:bg-zinc-800 rounded-full transition-all border border-transparent hover:border-zinc-700">
                                        <Avatar className="h-9 w-9 border border-zinc-700">
                                            <AvatarImage src={user.image || ""} alt={user.name || ""} />
                                            <AvatarFallback className="bg-gradient-to-br from-green-600 to-green-800 text-white font-bold text-xs">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-semibold text-zinc-100 pr-2 max-w-[150px] truncate hidden md:block">
                                            {user.name}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 bg-zinc-950 border-zinc-800 text-zinc-100" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-zinc-400">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-zinc-800" />
                                    <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white cursor-pointer" asChild>
                                        <Link href="/profile">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Thông tin cá nhân</span>
                                        </Link>
                                    </DropdownMenuItem>

                                    {user.role === 'ADMIN' && (
                                        <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white cursor-pointer" asChild>
                                            <Link href="/admin">
                                                <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                                                <span className="font-bold text-green-500">Trang quản trị</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    )}

                                    <DropdownMenuSeparator className="bg-zinc-800" />
                                    <DropdownMenuItem
                                        className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer"
                                        onClick={() => signOut()}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Đăng xuất</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white">Đăng nhập</Link>
                        )}
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-zinc-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-white/10 bg-zinc-950 p-4 space-y-4">
                    <Link href="/" className="block text-sm font-bold text-zinc-300 uppercase">Phim</Link>
                    <Link href="/cinemas" className="block text-sm font-bold text-zinc-300 uppercase">Rạp</Link>
                    <Link href="/member" className="block text-sm font-bold text-zinc-300 uppercase">Hội viên</Link>
                    <Link href="/promotions" className="block text-sm font-bold text-zinc-300 uppercase">Khuyến mãi</Link>
                    <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                        <Button asChild className="w-full bg-green-600 hover:bg-green-700 font-bold">
                            <Link href="/movies">Đặt vé ngay</Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full border-orange-500 text-orange-500 hover:bg-orange-500/10 font-bold">
                            <Link href="/concessions">Đặt bắp nước</Link>
                        </Button>
                        {user ? (
                            <div className="flex flex-col gap-2">
                                <Button variant="ghost" asChild className="w-full justify-start text-zinc-300">
                                    <Link href="/profile">
                                        <User className="mr-2 h-4 w-4" />
                                        {user.name}
                                    </Link>
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => signOut()}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Đăng xuất
                                </Button>
                            </div>
                        ) : (
                            <Button variant="ghost" asChild className="w-full justify-center text-zinc-300">
                                <Link href="/login">Đăng nhập / Đăng ký</Link>
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
