"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Clock, MapPin } from "lucide-react"

interface Showtime {
    id: string
    startTime: Date
    format: string
    hallId: string
    movieId: string
    movie: {
        id: string
        title: string
        posterUrl: string | null
        duration: number
        ageRating: string
    }
    hall: {
        name: string
    }
}

interface CinemaShowtimesProps {
    showtimes: Showtime[]
}

export function CinemaShowtimes({ showtimes }: CinemaShowtimesProps) {
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

    // Group by Movie
    const groupedByMovie = filteredShowtimes.reduce((acc, showtime) => {
        const movieId = showtime.movie.id
        if (!acc[movieId]) {
            acc[movieId] = {
                movie: showtime.movie,
                formats: {}
            }
        }

        const format = showtime.format
        if (!acc[movieId].formats[format]) {
            acc[movieId].formats[format] = []
        }
        acc[movieId].formats[format].push(showtime)

        return acc
    }, {} as Record<string, { movie: Showtime['movie'], formats: Record<string, Showtime[]> }>)

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Calendar className="text-green-600" />
                    Lịch Chiếu
                </h2>
            </div>

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

            {/* Movies List */}
            <div className="space-y-6">
                {Object.keys(groupedByMovie).length > 0 ? (
                    Object.values(groupedByMovie).map(({ movie, formats }) => (
                        <div key={movie.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:border-zinc-700 transition-colors">
                            {/* Movie Info */}
                            <div className="w-full md:w-32 shrink-0">
                                <Link href={`/movie/${movie.id}`}>
                                    <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-lg border border-zinc-800 relative group">
                                        <img
                                            src={movie.posterUrl || "/placeholder.jpg"}
                                            alt={movie.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                </Link>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1 hover:text-green-500 transition-colors">
                                        <Link href={`/movie/${movie.id}`}>{movie.title}</Link>
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                                        <span className="bg-zinc-800 text-white px-2 py-0.5 rounded text-xs font-bold">{movie.ageRating}</span>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{movie.duration} phút</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Formats & Showtimes */}
                                <div className="space-y-3">
                                    {Object.entries(formats).map(([format, shows]) => (
                                        <div key={format} className="space-y-2">
                                            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                                <span className={`${format === 'IMAX' ? 'text-blue-500' : 'text-zinc-400'}`}>
                                                    {format === 'TWO_D' ? '2D' : (format === 'THREE_D' ? '3D' : format)}
                                                </span>
                                                PHỤ ĐỀ
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {shows.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).map(showtime => (
                                                    <Button
                                                        key={showtime.id}
                                                        variant="outline"
                                                        className="h-9 px-3 border-zinc-700 bg-zinc-800/50 text-zinc-200 hover:border-green-500 hover:bg-green-600 hover:text-white transition-all font-mono text-sm"
                                                        asChild
                                                    >
                                                        <Link href={`/book/${showtime.id}`}>
                                                            {new Date(showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                        </Link>
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center border border-zinc-800 rounded-2xl bg-zinc-900/20 border-dashed">
                        <MapPin className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                        <p className="text-zinc-500">Chưa có lịch chiếu nào tại rạp này vào ngày đã chọn.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
