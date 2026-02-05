import { getMovieById } from "@/lib/data-service"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Star, PlayCircle, MapPin } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { TrailerDialog } from "@/components/movies/trailer-dialog"
import { MovieShowtimes } from "@/components/movies/movie-showtimes"

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const movie = await getMovieById(id) as any

    if (!movie) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-black text-zinc-100 font-sans">
            {/* Hero Backdrop */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center blur-sm opacity-50"
                    style={{ backgroundImage: `url(${movie.posterUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
            </div>

            <div className="container mx-auto px-4 -mt-64 relative z-10 pb-20">
                <div className="flex flex-col md:flex-row gap-10">
                    {/* Poster */}
                    <div className="w-full md:w-80 shrink-0">
                        <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-green-900/20 border border-zinc-800">
                            <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-6 pt-10">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="border-green-600 text-green-500 bg-green-600/10 uppercase tracking-widest text-xs font-bold px-3 py-1">
                                    Đang Chiếu
                                </Badge>
                                {movie.modelType && (
                                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                                        {movie.modelType}
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
                                {movie.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-300 font-medium">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-green-600" />
                                    <span>{movie.duration} phút</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-green-600" />
                                    <span>{new Date(movie.releaseDate).toLocaleDateString("vi-VN")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-white font-bold">{movie.rating}/10</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={`border-none px-2 py-0.5 text-xs font-bold ${movie.ageRating === 'P' ? 'bg-green-600/20 text-green-500' :
                                        movie.ageRating === 'K' ? 'bg-blue-600/20 text-blue-500' :
                                            movie.ageRating === 'C13' ? 'bg-yellow-600/20 text-yellow-500' :
                                                movie.ageRating === 'C16' ? 'bg-orange-600/20 text-orange-500' :
                                                    'bg-green-600/20 text-green-500'
                                        }`}>
                                        {movie.ageRating}
                                    </Badge>
                                    <span className="text-zinc-400">
                                        ({movie.ageRating === 'P' ? 'Phổ biến' :
                                            movie.ageRating === 'K' ? 'Dưới 13t với GH' :
                                                movie.ageRating === 'C13' ? '13+' :
                                                    movie.ageRating === 'C16' ? '16+' :
                                                        '18+'})
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="text-lg text-zinc-300 leading-relaxed max-w-3xl">
                            {movie.description}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {movie.genres?.map((g: any) => (
                                <Badge key={g.genreId} variant="outline" className="text-zinc-400 border-zinc-700 hover:text-white hover:border-white transition-colors">
                                    {g.genre.name}
                                </Badge>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button size="lg" className="bg-green-600 hover:bg-green-700 font-bold px-8 h-12 rounded-full shadow-[0_0_20px_rgba(22,163,74,0.4)] transition-transform hover:scale-105 active:scale-95" asChild>
                                <Link href="#showtimes">Mua Vé Ngay</Link>
                            </Button>
                            <TrailerDialog trailerUrl={movie.trailerUrl} title={movie.title} />
                        </div>
                    </div>
                </div>

                <Separator className="my-16 bg-zinc-800" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Showtimes */}
                    <MovieShowtimes showtimes={movie.showtimes} movieId={movie.id} />

                    {/* Right Column: Cast & Info */}
                    <div className="space-y-8">
                        {movie.director && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">Đạo Diễn</h2>
                                <div className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                                    <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden shrink-0">
                                        {movie.director.avatarUrl ? (
                                            <img src={movie.director.avatarUrl} alt={movie.director.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold text-xs">DIR</div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{movie.director.name}</p>
                                        <p className="text-xs text-zinc-500">Director</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <h2 className="text-2xl font-bold text-white">Diễn Viên</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {movie.cast?.slice(0, 4).map((role: any) => (
                                <div key={role.personId} className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden shrink-0">
                                        {role.person.avatarUrl && (
                                            <img src={role.person.avatarUrl} alt={role.person.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{role.person.name}</p>
                                        <p className="text-xs text-zinc-500">{role.character}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
