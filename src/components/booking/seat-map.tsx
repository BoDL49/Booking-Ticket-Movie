"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export type SeatType = "STANDARD" | "VIP" | "COUPLE"
export type SeatState = "AVAILABLE" | "SELECTED" | "OCCUPIED"

export interface Seat {
    id: string
    row: string
    number: number
    type: SeatType
    price: number
    status: SeatState
}

interface SeatMapProps {
    initialSeats: Seat[]
    onSelectionChange: (seats: Seat[]) => void
}

// Mock Data Generator
const generateSeats = (): Seat[] => {
    const seats: Seat[] = []
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J']

    rows.forEach((row, rowIndex) => {
        const seatsInRow = row === 'J' ? 14 : 16 // Last row couple seats

        for (let i = 1; i <= seatsInRow; i++) {
            let type: SeatType = 'STANDARD'
            let price = 90000

            if (rowIndex >= 3 && rowIndex <= 7) { // VIP Rows D-H
                type = 'VIP'
                price = 110000
            } else if (row === 'J') { // Couple Row
                type = 'COUPLE'
                price = 240000 // Pair price
            }

            // Simulate some occupied seats (Deterministic for SSR/Hydration match)
            const seatIndex = (rowIndex * 18) + i // Approximate index
            const isOccupied = (seatIndex * 12345) % 100 < 15 // Pseudo-random 15% chance

            seats.push({
                id: `${row}${i}`,
                row,
                number: i,
                type,
                price,
                status: isOccupied ? 'OCCUPIED' : 'AVAILABLE'
            })
        }
    })
    return seats
}

const mockSeats = generateSeats()

export function SeatMap({ initialSeats, onSelectionChange }: SeatMapProps) {
    const [seats, setSeats] = useState<Seat[]>(initialSeats)
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

    const handleSeatClick = (seat: Seat) => {
        if (seat.status === 'OCCUPIED') return

        const newSelectedIds = new Set(selectedIds)
        if (newSelectedIds.has(seat.id)) {
            newSelectedIds.delete(seat.id)
        } else {
            // Limit max 8 seats
            if (newSelectedIds.size >= 8) return
            newSelectedIds.add(seat.id)
        }

        setSelectedIds(newSelectedIds)

        // Notify parent
        const selectedSeatsList = seats.filter(s => newSelectedIds.has(s.id))
        onSelectionChange(selectedSeatsList)
    }

    // Helper to get seat color
    const getSeatColor = (seat: Seat, isSelected: boolean) => {
        if (seat.status === 'OCCUPIED') return "bg-zinc-800 cursor-not-allowed text-zinc-600 border-transparent"
        if (isSelected) return "bg-green-600 text-white border-green-500 shadow-[0_0_10px_rgba(22,163,74,0.6)]"

        switch (seat.type) {
            case 'VIP': return "bg-zinc-800 border-yellow-700/50 text-yellow-500 hover:bg-yellow-600 hover:text-white"
            case 'COUPLE': return "bg-zinc-800 border-pink-700/50 text-pink-500 hover:bg-pink-600 hover:text-white col-span-2 w-auto" // Couple spans 2
            default: return "bg-zinc-900 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
        }
    }

    return (
        <div className="w-full flex flex-col items-center">
            {/* Screen */}
            <div className="w-full max-w-3xl mb-12 relative">
                <div className="h-2 w-full bg-zinc-700 rounded-full mb-2"></div>
                <div className="h-16 w-full bg-gradient-to-b from-white/10 to-transparent clip-screen transform perspective-[500px] rotateX-[-30deg] opacity-50 blur-xl"></div>
                <p className="text-center text-zinc-500 text-sm mt-4 uppercase tracking-widest">Màn Hình</p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-zinc-800 border-none"></div>
                    <span>Đã đặt</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-700"></div>
                    <span>Thường</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-zinc-900 border border-yellow-700"></div>
                    <span>VIP</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-zinc-900 border border-pink-700"></div>
                    <span>Ghế Đôi</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-green-600 shadow-[0_0_8px_rgba(22,163,74,0.6)]"></div>
                    <span>Đang chọn</span>
                </div>
            </div>

            {/* Seat Rows */}
            <div className="w-full overflow-x-auto pb-12 px-4 no-scrollbar">
                <div className="min-w-[600px] flex flex-col gap-3 items-center">
                    {/* Group seats by row */}
                    {Array.from(new Set(seats.map(s => s.row))).sort().map(rowLabel => {
                        const rowSeats = seats.filter(s => s.row === rowLabel).sort((a, b) => a.number - b.number)

                        return (
                            <div key={rowLabel} className="flex gap-2 items-center">
                                {/* Row Label */}
                                <div className="w-6 text-center text-xs font-bold text-zinc-600 mr-2">
                                    {rowLabel}
                                </div>

                                {rowSeats.map(seat => (
                                    <button
                                        key={seat.id}
                                        onClick={() => handleSeatClick(seat)}
                                        className={cn(
                                            "h-8 md:h-10 w-8 md:w-10 rounded-t-lg md:rounded-t-xl rounded-b-sm md:rounded-b-md text-[10px] md:text-xs font-bold border transition-all duration-200 flex items-center justify-center relative group",
                                            getSeatColor(seat, selectedIds.has(seat.id)),
                                            seat.type === 'COUPLE' && "w-[4.5rem] md:w-[5.5rem] rounded-xl" // Custom width for couple
                                        )}
                                        disabled={seat.status === 'OCCUPIED'}
                                        title={`${seat.row}${seat.number} - ${seat.type} - ${seat.price.toLocaleString('vi-VN')}đ`}
                                    >
                                        {/* Seat Number */}
                                        <span className="z-10">{seat.number}</span>

                                        {/* Hover Effect Glow */}
                                        <div className="absolute inset-0 rounded-[inherit] bg-white/0 group-hover:bg-white/10 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
