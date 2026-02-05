"use client"

import { useState, useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Popcorn,
    Utensils,
    Zap,
    Sparkles,
    ShoppingBag,
    Minus,
    Plus,
    ShoppingCart,
    Loader2,
    X
} from "lucide-react"
import { createConcessionBooking } from "@/actions/concession-booking"
import { toast } from "sonner"

export function ConcessionsClient({ products, categories = [] }: { products: any[], categories?: any[] }) {
    const [cart, setCart] = useState<Record<string, number>>({})
    const [isPending, startTransition] = useTransition()
    const [activeCategory, setActiveCategory] = useState("ALL")

    // Build categories filter from database
    const categoryFilters = [
        { id: "ALL", label: "Tất cả", icon: Popcorn },
        ...categories.map(cat => ({
            id: cat.id,
            label: cat.name,
            icon: cat.name.toLowerCase().includes('combo') ? Sparkles
                : cat.name.toLowerCase().includes('nước') ? Zap
                    : Utensils
        }))
    ]

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => {
            const current = prev[id] || 0
            const next = Math.max(0, current + delta)
            if (next === 0) {
                const { [id]: _, ...rest } = prev
                return rest
            }
            return { ...prev, [id]: next }
        })
    }

    const cartItems = Object.entries(cart).map(([id, quantity]) => {
        const product = products.find(p => p.id === id)
        return {
            ...product,
            quantity
        }
    })

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    const handleCheckout = () => {
        if (cartItems.length === 0) return

        startTransition(async () => {
            const result = await createConcessionBooking(cartItems, totalAmount)
            if (result.error) {
                toast.error(result.error)
            } else if (result.checkoutUrl) {
                window.location.href = result.checkoutUrl
            }
        })
    }

    const filteredProducts = activeCategory === "ALL"
        ? products
        : products.filter(p => p.categoryId === activeCategory)

    return (
        <>
            {/* Categories Filter Bar */}
            <div className="flex gap-4 mb-10 overflow-x-auto pb-2 no-scrollbar">
                {categoryFilters.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`rounded-full px-6 font-bold h-11 text-sm transition-all whitespace-nowrap border ${activeCategory === cat.id
                            ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-900/20"
                            : "border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white"
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                    <Card key={product.id} className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-all group overflow-hidden shadow-xl flex flex-col">
                        <div className="w-full aspect-video relative overflow-hidden shrink-0">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {product.category === 'COMBO' && (
                                <div className="absolute top-2 left-2">
                                    <Badge className="bg-orange-500 text-[10px] font-bold uppercase italic shadow-lg">Bán chạy</Badge>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 p-6 flex flex-col justify-between">
                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-black text-xl text-zinc-100 group-hover:text-orange-500 transition-colors lowercase leading-tight">{product.name}</h3>
                                    <Zap className="h-5 w-5 text-orange-500 opacity-20" />
                                </div>
                                <p className="text-zinc-500 text-sm italic">{product.description}</p>
                            </div>

                            <div className="mt-6 flex items-center justify-between gap-4">
                                <span className="text-2xl font-black text-white italic tracking-tighter">
                                    {product.price.toLocaleString('vi-VN')} <span className="text-sm font-normal text-zinc-600 not-italic">đ</span>
                                </span>

                                <div className="flex items-center gap-3 bg-zinc-950 rounded-full p-1 border border-zinc-800">
                                    {cart[product.id] ? (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white"
                                                onClick={() => updateQuantity(product.id, -1)}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </Button>
                                            <span className="text-sm font-bold w-4 text-center text-white">{cart[product.id]}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white"
                                                onClick={() => updateQuantity(product.id, 1)}
                                            >
                                                <Plus className="w-3 h-3" />
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            size="sm"
                                            className="bg-zinc-100 hover:bg-white text-black font-black rounded-full px-4 h-8 gap-1.5 transition-all"
                                            onClick={() => updateQuantity(product.id, 1)}
                                        >
                                            <ShoppingBag className="w-3.5 h-3.5" /> THÊM
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Floating Cart Bar (Visible when items selected) */}
            {totalItems > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-5">
                    <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-green-600 flex items-center justify-center text-white relative">
                                <ShoppingCart className="w-6 h-6" />
                                <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-green-600">
                                    {totalItems}
                                </span>
                            </div>
                            <div>
                                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Tổng cộng</p>
                                <p className="text-xl font-black text-white italic tracking-tight">{totalAmount.toLocaleString('vi-VN')} đ</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 text-zinc-500 hover:text-white"
                                onClick={() => setCart({})}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white font-black px-8 h-12 rounded-xl shadow-lg shadow-green-900/20 gap-2 shrink-0"
                                onClick={handleCheckout}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> XỬ LÝ...
                                    </>
                                ) : (
                                    <>THANH TOÁN NGAY</>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
