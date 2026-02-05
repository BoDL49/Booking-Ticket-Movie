"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, Plus } from "lucide-react"
import Image from "next/image"

export interface ProductItem {
    id: string
    name: string
    price: number
    quantity: number
}

interface Product {
    id: string
    name: string
    price: number
    description: string | null
    image: string | null
}

interface ConcessionsProps {
    products: Product[]
    onSelectionChange: (products: ProductItem[]) => void
}

export function ConcessionsSelection({ products, onSelectionChange }: ConcessionsProps) {
    const [counts, setCounts] = useState<Record<string, number>>({})

    const handleUpdate = (product: { id: string; name: string; price: number }, delta: number) => {
        const currentCheck = counts[product.id] || 0
        const newCount = Math.max(0, currentCheck + delta)

        const newCounts = { ...counts, [product.id]: newCount }
        setCounts(newCounts)

        // Convert to array format for parent
        const items: ProductItem[] = Object.keys(newCounts)
            .filter(id => newCounts[id] > 0)
            .map(id => {
                const p = products.find(p => p.id === id)!
                return {
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    quantity: newCounts[id]
                }
            })

        onSelectionChange(items)
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map(product => (
                    <Card key={product.id} className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all">
                        <CardContent className="p-0 flex h-32">
                            <div className="w-32 h-full relative shrink-0 bg-zinc-800">
                                {product.image ? (
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                        <span className="text-xs">No Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 p-4 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-zinc-100 line-clamp-1">{product.name}</h3>
                                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{product.description || "Ngon tuyệt vời"}</p>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="font-bold text-green-500">{product.price.toLocaleString('vi-VN')} đ</span>

                                    <div className="flex items-center gap-3 bg-zinc-950 rounded-lg p-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-zinc-800"
                                            onClick={() => handleUpdate(product, -1)}
                                            disabled={!counts[product.id]}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="text-sm font-bold w-4 text-center text-white">{counts[product.id] || 0}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-zinc-800"
                                            onClick={() => handleUpdate(product, 1)}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
