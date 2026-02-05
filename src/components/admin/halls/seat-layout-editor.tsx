"use client"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { updateHallLayout } from "@/actions/admin/seat-actions"
import { toast } from "sonner"
import { Loader2, Save, Armchair, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface Seat {
    row: string
    number: number
    type: "STANDARD" | "VIP" | "COUPLE"
}

interface Props {
    hallId: string
    initialSeats: Seat[]
    hallName: string
}

export function SeatLayoutEditor({ hallId, initialSeats, hallName }: Props) {
    // Determine initial grid size based on seats or default
    const maxRowChar = initialSeats.length > 0
        ? initialSeats.reduce((max, s) => s.row > max ? s.row : max, "A")
        : "J"
    const maxColNum = initialSeats.length > 0
        ? Math.max(...initialSeats.map(s => s.number))
        : 10

    const rowCountInit = maxRowChar.charCodeAt(0) - 64 // A=1, B=2

    const [rows, setRows] = useState(rowCountInit)
    const [cols, setCols] = useState(maxColNum)
    // Map "Row-Col" -> SeatType | null (null = no seat/aisle)
    const [layout, setLayout] = useState<Record<string, string>>({})
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        const initialMap: Record<string, string> = {}
        initialSeats.forEach(s => {
            initialMap[`${s.row}-${s.number}`] = s.type
        })
        setLayout(initialMap)
    }, [initialSeats])

    const generateRowLabel = (index: number) => String.fromCharCode(65 + index) // 0->A

    const toggleSeat = (r: number, c: number) => {
        const rowLabel = generateRowLabel(r)
        const key = `${rowLabel}-${c + 1}`
        const current = layout[key]

        let next: string | undefined

        if (!current) next = "STANDARD"
        else if (current === "STANDARD") next = "VIP"
        else if (current === "VIP") next = "COUPLE"
        else next = undefined // Remove

        setLayout(prev => {
            const newLayout = { ...prev }
            if (next) newLayout[key] = next
            else delete newLayout[key]
            return newLayout
        })
    }

    const handleSave = () => {
        const seatsToSave: Seat[] = []
        Object.entries(layout).forEach(([key, type]) => {
            const [rowChar, numStr] = key.split("-")
            const num = parseInt(numStr)
            const rowIndex = rowChar.charCodeAt(0) - 65 // A->0

            // Only save seats within current grid limits
            if (rowIndex < rows && num <= cols) {
                seatsToSave.push({
                    row: rowChar,
                    number: num,
                    type: type as any
                })
            }
        })

        startTransition(async () => {
            const result = await updateHallLayout(hallId, seatsToSave, seatsToSave.length)
            if (result.success) {
                toast.success(result.success)
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleReset = () => {
        if (confirm("Reset layout to default grid?")) {
            const newLayout: Record<string, string> = {}
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    newLayout[`${generateRowLabel(r)}-${c + 1}`] = "STANDARD"
                }
            }
            setLayout(newLayout)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold uppercase text-zinc-500">Rows</Label>
                        <Input
                            type="number"
                            min={1}
                            max={26}
                            value={rows}
                            onChange={e => setRows(Number(e.target.value))}
                            className="w-20 bg-zinc-950 border-zinc-800 font-bold text-center"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold uppercase text-zinc-500">Columns</Label>
                        <Input
                            type="number"
                            min={1}
                            max={30}
                            value={cols}
                            onChange={e => setCols(Number(e.target.value))}
                            className="w-20 bg-zinc-950 border-zinc-800 font-bold text-center"
                        />
                    </div>
                    <Button variant="outline" size="icon" onClick={handleReset} className="mt-5 border-zinc-700 hover:bg-zinc-800">
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex gap-2 text-xs font-bold uppercase">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-lg border border-white/5">
                        <div className="w-4 h-4 bg-zinc-700/50 border border-white/20 rounded" /> Standard
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-lg border border-white/5">
                        <div className="w-4 h-4 bg-purple-500/20 border-purple-500/50 rounded" /> VIP
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-lg border border-white/5">
                        <div className="w-4 h-4 bg-pink-500/20 border-pink-500/50 rounded" /> Couple
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-lg border border-white/5">
                        <div className="w-4 h-4 border border-zinc-800 border-dashed rounded" /> Empty
                    </div>
                </div>

                <Button onClick={handleSave} disabled={isPending} className="bg-green-600 hover:bg-green-700 text-white font-bold gap-2">
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Lưu Thay Đổi
                </Button>
            </div>

            <div className="border border-white/5 rounded-2xl p-8 bg-black/50 overflow-auto min-h-[500px] flex items-center justify-center relative">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/20 rounded-full mb-8 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-zinc-600 uppercase font-black tracking-[0.3em]">Screen</span>
                </div>

                <div
                    className="grid gap-2 mt-12"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
                    }}
                >
                    {Array.from({ length: rows }).map((_, r) => (
                        Array.from({ length: cols }).map((_, c) => {
                            const rowLabel = generateRowLabel(r)
                            const key = `${rowLabel}-${c + 1}`
                            const type = layout[key]

                            return (
                                <div
                                    key={key}
                                    onClick={() => toggleSeat(r, c)}
                                    className={cn(
                                        "w-8 h-8 rounded text-[10px] font-bold flex items-center justify-center cursor-pointer transition-all hover:scale-110 select-none",
                                        !type && "bg-transparent border border-zinc-800 border-dashed text-zinc-800 hover:border-zinc-700",
                                        type === "STANDARD" && "bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-white",
                                        type === "VIP" && "bg-purple-900/40 border border-purple-500/50 text-purple-400 hover:bg-purple-900/60 hover:text-purple-300",
                                        type === "COUPLE" && "bg-pink-900/40 border border-pink-500/50 text-pink-400 hover:bg-pink-900/60 hover:text-pink-300 w-full col-span-1" // Couple logic logic visualization is tricky in uniform grid, keep simple 1x1 for now or visual distinction
                                    )}
                                    title={`${rowLabel}${c + 1} - ${type || "Empty"}`}
                                >
                                    {type ? `${rowLabel}${c + 1}` : ""}
                                </div>
                            )
                        })
                    ))}
                </div>
            </div>

            <div className="text-center text-zinc-500 text-sm italic">
                * Click on a seat to cycle types: Standard → VIP → Couple → Empty → Standard
            </div>
        </div>
    )
}
