"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin } from "lucide-react"

interface Showtime {
    id: string
    startTime: Date
    format: string
    hallId: string
    movieId: string
    hall?: {
        cinema?: {
            name: string
        }
    }
}

interface MovieShowtimesProps {
    showtimes: Showtime[]
    movieId: string
}

export function MovieShowtimes({ showtimes, movieId }: MovieShowtimesProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())

    // Generate next 5 days
    const dates = Array.from({ length: 5 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() + i)
        return date
    })

    // Filter showtimes for selected date
    const filteredShowtimes = showtimes.filter(showtime => {
        const showtimeDate = new Date(showtime.startTime)
        return (
            showtimeDate.getDate() === selectedDate.getDate() &&
            showtimeDate.getMonth() === selectedDate.getMonth() &&
            showtimeDate.getFullYear() === selectedDate.getFullYear()
        )
    })

    // Group by Cinema first, then by Format
    // Structure: { "CinemaName": { "2D": [Showtime, ...], "3D": [...] } }
    const groupedByCinema = filteredShowtimes.reduce((acc, showtime) => {
        const cinemaName = showtime.hall?.cinema?.name || "BơCinema Center"
        const format = showtime.format

        if (!acc[cinemaName]) {
            acc[cinemaName] = {}
        }
        if (!acc[cinemaName][format]) {
            acc[cinemaName][format] = []
        }
        acc[cinemaName][format].push(showtime)
        return acc
    }, {} as Record<string, Record<string, any[]>>)

    return (
        <div className="lg:col-span-2 space-y-8" id="showtimes">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <MapPin className="text-green-500" /> Lịch Chiếu
            </h2>

            {/* Date Picker */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {dates.map((date, index) => {
                    const isSelected = date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth()
                    const dayName = index === 0 ? "Hôm nay" : `Th ${date.getDay() + 1 === 1 ? 'Cn' : date.getDay() + 1}`

                    return (
                        <button
                            key={index}
                            onClick={() => setSelectedDate(date)}
                            className={`flex flex-col items-center justify-center min-w-[80px] h-20 rounded-xl border transition-all ${isSelected
                                ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-900/40"
                                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800"
                                }`}
                        >
                            <span className="text-xs font-medium uppercase opacity-80">
                                {dayName}
                            </span>
                            <span className="text-2xl font-bold">
                                {date.getDate()}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Showtimes List */}
            <div className="space-y-8">
                {Object.keys(groupedByCinema).length > 0 ? (
                    Object.entries(groupedByCinema).map(([cinemaName, formats]) => (
                        <div key={cinemaName} className="space-y-4">
                            {/* Cinema Header */}
                            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden">
                                <div className="p-4 bg-zinc-950/50 border-b border-zinc-800 flex items-center gap-3">
                                    <MapPin className="text-green-500 w-5 h-5" />
                                    <h3 className="text-lg font-bold text-white">{cinemaName}</h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    {Object.entries(formats).map(([format, shows]) => (
                                        <div key={format}>
                                            <h4 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-xs font-black ${format === 'IMAX' ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-white'
                                                    }`}>
                                                    {format === 'TWO_D' ? '2D' : (format === 'THREE_D' ? '3D' : format)}
                                                </span>
                                                Phụ Đề
                                            </h4>
                                            <div className="flex flex-wrap gap-3">
                                                {shows.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).map((showtime) => {
                                                    const startTime = new Date(showtime.startTime)
                                                    const now = new Date()
                                                    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000)
                                                    // Check if showtime started more than 30 mins ago
                                                    const isExpired = startTime < thirtyMinutesAgo

                                                    if (isExpired) {
                                                        return (
                                                            <Button
                                                                key={showtime.id}
                                                                variant="outline"
                                                                disabled
                                                                className="border-zinc-800 bg-zinc-900/50 text-zinc-600 cursor-not-allowed font-medium min-w-[100px] hover:bg-zinc-900/50"
                                                            >
                                                                {startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                            </Button>
                                                        )
                                                    }

                                                    return (
                                                        <Button
                                                            key={showtime.id}
                                                            variant="outline"
                                                            className="border-zinc-700 bg-zinc-800 text-zinc-100 hover:border-green-500 hover:text-white hover:bg-green-600 font-bold min-w-[100px]"
                                                            asChild
                                                        >
                                                            <Link href={`/book/${showtime.id}`}>
                                                                {startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                            </Link>
                                                        </Button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center border border-zinc-800 rounded-2xl bg-zinc-900/50 flex flex-col items-center gap-2">
                        <MapPin className="w-8 h-8 text-zinc-600" />
                        <p className="text-zinc-500 font-medium">Chưa có lịch chiếu cho ngày này.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
