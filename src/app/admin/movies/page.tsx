import { db } from "@/lib/db"
import { Film } from "lucide-react"
import { MoviesTable } from "@/components/admin/movies/movies-table"

export default async function AdminMoviesPage() {
    const [movies, persons, genres] = await Promise.all([
        db.movie.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                director: true,
                cast: { include: { person: true } }
            }
        }),
        db.person.findMany({
            orderBy: { name: 'asc' }
        }),
        db.genre.findMany({
            orderBy: { name: 'asc' }
        })
    ])

    const totalMovies = movies.length
    const nowShowingCount = movies.filter((m: any) => m.status === 'NOW_SHOWING').length
    const upcomingCount = movies.filter((m: any) => m.status === 'COMING_SOON').length

    return (
        <div className="space-y-8 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-500 font-black text-xs uppercase tracking-[0.3em]">
                        <Film className="w-4 h-4" /> Cinema Library
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">
                        Quản lý <span className="text-green-600">Phim Truyện</span>
                    </h1>
                    <p className="text-zinc-500 max-w-md italic">Cửa sổ tâm hồn của BơCinema. Quản lý kho phim, diễn viên và đạo diễn.</p>
                </div>

                <div className="flex items-center gap-3">
                    <MoviesTable movies={movies as any} persons={persons as any} genres={genres as any} mode="add-trigger" />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 text-white/5 group-hover:text-white/10 transition-colors">
                        <Film size={80} />
                    </div>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Tổng kho phim</p>
                    <p className="text-3xl font-black italic tracking-tighter text-blue-500">{totalMovies}</p>
                </div>
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-xl">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Đang công chiếu</p>
                    <p className="text-3xl font-black italic tracking-tighter text-green-500">{nowShowingCount}</p>
                </div>
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-xl">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Sắp ra mắt</p>
                    <p className="text-3xl font-black italic tracking-tighter text-yellow-500">{upcomingCount}</p>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 bg-zinc-900/50 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                <MoviesTable movies={movies as any} persons={persons as any} genres={genres as any} />
            </div>
        </div>
    )
}
