"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link"
import { PlayCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import { TrailerDialog } from "@/components/movies/trailer-dialog"

export function HeroSlider({ movies }: { movies: any[] }) {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    )

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full h-[85vh] overflow-hidden"
            opts={{
                loop: true,
            }}
        >
            <CarouselContent className="ml-0 h-full">
                {movies.map((movie) => (
                    <CarouselItem key={movie.id} className="pl-0 h-full relative basis-full group/slide">
                        <div className="relative h-full w-full overflow-hidden">
                            {/* Full-screen backdrop image */}
                            <div
                                className="absolute inset-0 bg-cover bg-top transition-transform duration-700 ease-out group-hover/slide:scale-105"
                                style={{ backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})` }}
                            />

                            {/* Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-20" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-20" />

                            {/* Content (Old Way Style) */}
                            <div className="absolute inset-0 z-30 flex items-center px-4 md:px-20">
                                <div className="max-w-2xl space-y-6 pt-20 animate-in fade-in slide-in-from-left-10 duration-1000">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 rounded-full bg-green-600/20 text-green-500 text-xs font-black uppercase tracking-[0.2em] border border-green-600/30 backdrop-blur-md">
                                            #1 Phim Thịnh Hành
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20 backdrop-blur-md italic">
                                            {movie.ageRating} • {movie.duration}m
                                        </span>
                                    </div>

                                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase italic leading-[0.9] drop-shadow-2xl">
                                        {movie.title}
                                    </h1>

                                    <p className="text-lg text-zinc-300 line-clamp-3 leading-relaxed max-w-xl italic drop-shadow-md">
                                        {movie.description}
                                    </p>

                                    <div className="flex items-center gap-4 pt-4">
                                        <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-black italic uppercase tracking-tighter rounded-full px-10 h-14 shadow-2xl shadow-green-900/40 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all" asChild>
                                            <Link href={`/movie/${movie.id}`}>ĐẶT VÉ NGAY</Link>
                                        </Button>
                                        <TrailerDialog
                                            trailerUrl={movie.trailerUrl}
                                            title={movie.title}
                                            trigger={
                                                <Button variant="ghost" className="text-white font-black uppercase italic tracking-tighter gap-3 hover:bg-white/10 px-8 h-14 rounded-full border border-white/10 backdrop-blur-md">
                                                    <PlayCircle className="w-5 h-5 opacity-60" /> Xem Trailer
                                                </Button>
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}
