"use client"

import { useState, useTransition } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Trash2, Calendar, Clock, MapPin, Film } from "lucide-react"
import { deleteShowtime } from "@/actions/admin/showtime-actions"
import { toast } from "sonner"
import { CreateShowtimeDialog } from "./create-showtime-dialog"
import { DeleteAlertDialog } from "@/components/admin/delete-alert-dialog"

interface ShowtimesTableProps {
    showtimes: any[]
    movies: any[]
    halls: any[]
}

export function ShowtimesTable({ showtimes, movies, halls }: ShowtimesTableProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [movieFilter, setMovieFilter] = useState("ALL")
    const [hallFilter, setHallFilter] = useState("ALL")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const filteredShowtimes = showtimes.filter(showtime => {
        const matchesSearch = showtime.movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            showtime.hall.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesMovie = movieFilter === "ALL" || showtime.movieId === movieFilter
        const matchesHall = hallFilter === "ALL" || showtime.hallId === hallFilter
        return matchesSearch && matchesMovie && matchesHall
    })

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [showtimeToDelete, setShowtimeToDelete] = useState<string | null>(null)

    const handleDeleteClick = (id: string) => {
        setShowtimeToDelete(id)
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        if (!showtimeToDelete) return

        startTransition(async () => {
            const result = await deleteShowtime(showtimeToDelete)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(result.success)
                setDeleteDialogOpen(false)
            }
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6 bg-zinc-950/30 p-4 rounded-2xl border border-white/5">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-green-500 transition-colors" />
                    <Input
                        placeholder="Tìm theo tên phim hoặc phòng..."
                        className="pl-10 bg-zinc-900 border-zinc-800 focus:ring-green-500/20 focus:border-green-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Select value={movieFilter} onValueChange={setMovieFilter}>
                        <SelectTrigger className="w-full md:w-[200px] bg-zinc-900 border-zinc-800">
                            <SelectValue placeholder="Lọc theo phim" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            <SelectItem value="ALL">Tất cả phim</SelectItem>
                            {movies.map(m => (
                                <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={hallFilter} onValueChange={setHallFilter}>
                        <SelectTrigger className="w-full md:w-[200px] bg-zinc-900 border-zinc-800">
                            <SelectValue placeholder="Lọc theo rạp" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            <SelectItem value="ALL">Tất cả rạp</SelectItem>
                            {halls.map(h => (
                                <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button onClick={() => setIsCreateOpen(true)} className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-900/20 gap-2">
                        <Plus className="w-4 h-4" /> Thêm Suất Chiếu
                    </Button>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] overflow-hidden shadow-xl">
                <Table>
                    <TableHeader className="bg-zinc-950/50">
                        <TableRow className="border-white/5 hover:bg-transparent">
                            <TableHead className="font-bold text-zinc-400 pl-6">Phim</TableHead>
                            <TableHead className="font-bold text-zinc-400">Phòng chiếu</TableHead>
                            <TableHead className="font-bold text-zinc-400">Thời gian</TableHead>
                            <TableHead className="font-bold text-zinc-400">Định dạng</TableHead>
                            <TableHead className="font-bold text-zinc-400">Giá vé</TableHead>
                            <TableHead className="text-right font-bold text-zinc-400 pr-6">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredShowtimes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-zinc-500 font-bold italic">
                                    Không tìm thấy suất chiếu nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredShowtimes.map((showtime) => (
                                <TableRow key={showtime.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                    <TableCell className="pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-14 rounded bg-zinc-800 overflow-hidden shrink-0">
                                                {showtime.movie.posterUrl ? (
                                                    <img src={showtime.movie.posterUrl} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <Film className="w-full h-full p-2 text-zinc-600" />
                                                )}
                                            </div>
                                            <span className="font-bold text-white max-w-[200px] truncate" title={showtime.movie.title}>
                                                {showtime.movie.title}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-zinc-500" />
                                            <span className="text-zinc-300">{showtime.hall.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <div className="flex items-center gap-2 text-white font-bold">
                                                <Clock className="w-3 h-3 text-green-500" />
                                                {new Date(showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-500 text-xs mt-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(showtime.startTime).toLocaleDateString('vi-VN')}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <span className="bg-zinc-800 text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded border border-white/10">
                                                {showtime.format === 'TWO_D' ? '2D' : showtime.format === 'THREE_D' ? '3D' : 'IMAX'}
                                            </span>
                                            <span className="bg-zinc-800 text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded border border-white/10">
                                                {showtime.language === 'VIETSUB' ? 'Phụ đề' : 'Lồng tiếng'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-green-500 font-bold">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(showtime.basePrice)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-zinc-500 hover:text-green-500 hover:bg-green-500/10"
                                            onClick={() => handleDeleteClick(showtime.id)}
                                            disabled={isPending}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <CreateShowtimeDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                movies={movies}
                halls={halls}
            />

            <DeleteAlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                isDeleting={isPending}
                title="Xác nhận xóa suất chiếu"
                description="Bạn có chắc chắn muốn xóa suất chiếu này không? Hành động này không thể hoàn tác."
            />
        </div>
    )
}
