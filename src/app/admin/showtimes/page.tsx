import { getShowtimes, getMoviesAndHalls } from "@/actions/admin/showtime-actions"
import { ShowtimesTable } from "@/components/admin/showtimes/showtimes-table"
import { CalendarClock } from "lucide-react"

export default async function AdminShowtimesPage() {
    const { showtimes } = await getShowtimes()
    const { movies, halls } = await getMoviesAndHalls()

    if (!showtimes || !movies || !halls) {
        return <div className="text-white">Có lỗi khi tải dữ liệu.</div>
    }

    return (
        <div className="space-y-8 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-500 font-black text-xs uppercase tracking-[0.3em]">
                        <CalendarClock className="w-4 h-4" /> Schedule Master
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">
                        Quản lý <span className="text-green-600">Suất Chiếu</span>
                    </h1>
                    <p className="text-zinc-500 max-w-md italic">
                        Lên lịch chiếu phim, sắp xếp phòng chiếu và định giá vé.
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-xl">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Tổng suất chiếu</p>
                    <p className="text-3xl font-black italic tracking-tighter text-white">{showtimes.length}</p>
                </div>
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-xl">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Số lượng phim đang chiếu</p>
                    <p className="text-3xl font-black italic tracking-tighter text-blue-500">{new Set(showtimes.map((s: any) => s.movieId)).size}</p>
                </div>
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-xl">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Phòng chiếu hoạt động</p>
                    <p className="text-3xl font-black italic tracking-tighter text-green-500">{halls.length}</p>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1">
                <ShowtimesTable
                    showtimes={showtimes as any}
                    movies={movies as any}
                    halls={halls as any}
                />
            </div>
        </div>
    )
}
