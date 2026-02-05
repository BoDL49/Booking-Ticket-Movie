import { getAllMovies, getAllGenres } from "@/lib/data-service"
import { MovieCard } from "@/components/movies/movie-card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Filter, SearchX, SlidersHorizontal } from "lucide-react"

export default async function MoviesPage({
    searchParams
}: {
    searchParams: Promise<{ search?: string; genre?: string; status?: string }>
}) {
    const { search, genre, status = "NOW_SHOWING" } = await searchParams
    const movies = await getAllMovies(search, genre, status)
    const genres = await getAllGenres()

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Link
                                href={`/movies?status=NOW_SHOWING${genre ? `&genre=${genre}` : ''}${search ? `&search=${search}` : ''}`}
                                className={`text-xl font-black italic uppercase tracking-tight pb-2 border-b-4 transition-all ${status === "NOW_SHOWING" ? "border-green-600 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
                            >
                                Đang Chiếu
                            </Link>
                            <Link
                                href={`/movies?status=COMING_SOON${genre ? `&genre=${genre}` : ''}${search ? `&search=${search}` : ''}`}
                                className={`text-xl font-black italic uppercase tracking-tight pb-2 border-b-4 transition-all ${status === "COMING_SOON" ? "border-green-600 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
                            >
                                Sắp Chiếu
                            </Link>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tighter">
                            {search ? `Kết quả tìm kiếm: "${search}"` : (genre ? `Phim thể loại: ${genres.find((g: any) => g.slug === genre)?.name || genre}` : status === "NOW_SHOWING" ? "Phim Đang Chiếu" : "Phim Sắp Chiếu")}
                        </h1>
                        <p className="text-zinc-400">Khám phá những bộ phim bom tấn tại BơCinema</p>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                        <Badge asChild variant={!genre ? "default" : "outline"} className={`cursor-pointer rounded-full px-4 py-1.5 font-bold ${!genre ? 'bg-green-600' : 'border-zinc-800 text-zinc-400 hover:text-white'}`}>
                            <Link href="/movies">Tất cả</Link>
                        </Badge>
                        {genres.map((g: any) => (
                            <Badge
                                key={g.id}
                                asChild
                                variant={genre === g.slug ? "default" : "outline"}
                                className={`cursor-pointer rounded-full px-4 py-1.5 font-bold whitespace-nowrap ${genre === g.slug ? 'bg-green-600' : 'border-zinc-800 text-zinc-400 hover:text-white'}`}
                            >
                                <Link href={`/movies?genre=${g.slug}${search ? `&search=${search}` : ''}`}>
                                    {g.name}
                                </Link>
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {movies.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
                        {movies.map((movie: any) => (
                            <MovieCard
                                key={movie.id}
                                id={movie.id}
                                title={movie.title}
                                posterUrl={movie.posterUrl}
                                genre={movie.genres[0]?.genre.name || "Phim"}
                                rating={movie.rating || 0}
                                ageRating={movie.ageRating}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="h-20 w-20 rounded-full bg-zinc-900 flex items-center justify-center">
                            <SearchX className="h-10 w-10 text-zinc-700" />
                        </div>
                        <h2 className="text-2xl font-bold">Không tìm thấy phim nào</h2>
                        <p className="text-zinc-500 max-w-xs">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để xem nhiều phim hơn.</p>
                        <Link href="/movies" className="text-green-500 font-bold hover:underline">
                            Xem tất cả phim
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
