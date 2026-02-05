"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { PlayCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { TrailerDialog } from "@/components/movies/trailer-dialog"

interface Movie {
    id: string
    title: string
    posterUrl: string | null
    genres: { genre: { name: string } }[]
    rating: number | null
    ageRating: string
    trailerUrl: string | null
    releaseDate: Date
}

export function ComingSoonCarousel({ movies }: { movies: Movie[] }) {
    if (movies.length === 0) return null

    return (
        <div className="relative group">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {movies.map((movie) => (
                        <CarouselItem key={movie.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                            <div className="flex flex-col h-full space-y-4">
                                {/* Poster Container */}
                                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-xl group/card">
                                    {movie.posterUrl ? (
                                        <Image
                                            src={movie.posterUrl}
                                            alt={movie.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-zinc-700 font-black italic">NO POSTER</div>
                                    )}

                                    {/* Age Rating Badge */}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <div className="bg-zinc-950/80 backdrop-blur-md border border-white/20 rounded px-1.5 py-0.5 flex items-center gap-1">
                                            <span className="text-[10px] font-black text-white italic tracking-tighter uppercase">2D</span>
                                        </div>
                                        <div className={`text-[10px] font-black italic tracking-tighter px-1.5 py-0.5 rounded text-white shadow-lg ${movie.ageRating === 'P' ? 'bg-green-500' :
                                            movie.ageRating === 'K' ? 'bg-blue-500' :
                                                movie.ageRating === 'C13' ? 'bg-yellow-500' :
                                                    movie.ageRating === 'C16' ? 'bg-orange-500' : 'bg-red-600'
                                            }`}>
                                            {movie.ageRating}
                                        </div>
                                    </div>

                                    {/* Format Badge (Overlay) */}
                                    {movie.releaseDate && (
                                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase italic tracking-wider">
                                            Khởi chiếu {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}
                                        </div>
                                    )}
                                </div>

                                {/* Content Below Poster */}
                                <div className="space-y-3 flex-1 flex flex-col items-center text-center">
                                    <h3 className="text-sm font-black italic uppercase tracking-tighter text-white line-clamp-2 h-10 group-hover:text-green-500 transition-colors">
                                        {movie.title} ({movie.ageRating})
                                    </h3>

                                    <div className="flex flex-col w-full gap-2 mt-auto">
                                        <div className="flex items-center justify-center gap-2">
                                            <PlayCircle className="w-4 h-4 text-white opacity-80" />
                                            <TrailerDialog
                                                trailerUrl={movie.trailerUrl}
                                                title={movie.title}
                                                trigger={
                                                    <span className="text-[11px] font-black text-white hover:text-green-500 hover:underline underline-offset-4 decoration-2 uppercase italic cursor-pointer transition-all">
                                                        Xem Trailer
                                                    </span>
                                                }
                                            />
                                        </div>

                                        <Button
                                            asChild
                                            className="w-full bg-green-600 hover:bg-green-700 text-white font-black italic uppercase tracking-tighter rounded-sm transform transition-all active:scale-95 shadow-[0_4px_0_#15803d]"
                                        >
                                            <Link href={`/book/${movie.id}`}>Đặt Vé</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Navigation Buttons */}
                <div className="hidden md:block">
                    <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-zinc-900 border-zinc-800 text-white hover:bg-green-600 hover:border-green-600 transition-all duration-300 shadow-2xl" />
                    <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-zinc-900 border-zinc-800 text-white hover:bg-green-600 hover:border-green-600 transition-all duration-300 shadow-2xl" />
                </div>
            </Carousel>
        </div>
    )
}
