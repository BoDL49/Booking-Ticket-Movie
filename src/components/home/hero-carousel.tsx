"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"

interface Slider {
    id: string
    title: string
    imageUrl: string | null
    linkUrl?: string | null
    description?: string | null
    movieId?: string | null
    movie?: {
        posterUrl: string
        title: string
    } | null
}

export function HeroCarousel({ sliders }: { sliders: Slider[] }) {
    const plugin = React.useRef(
        Autoplay({ delay: 6000, stopOnInteraction: true })
    )

    const getDisplayImage = (slider: Slider) => {
        // Prefer movie poster if movieId exists
        if (slider.movieId && slider.movie?.posterUrl) {
            return slider.movie.posterUrl
        }
        // Fallback to custom imageUrl
        return slider.imageUrl || "/placeholder-slider.jpg"
    }

    if (!sliders || sliders.length === 0) return null

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full h-[85vh] overflow-hidden group"
            opts={{
                loop: true,
            }}
        >
            <CarouselContent className="ml-0 h-full">
                {sliders.map((slider) => (
                    <CarouselItem key={slider.id} className="pl-0 h-full relative basis-full group/slide">
                        <div className="relative h-full w-full overflow-hidden">
                            {/* Full-screen backdrop image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover/slide:scale-105"
                                style={{ backgroundImage: `url(${getDisplayImage(slider)})` }}
                            />

                            {/* Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-20" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-20" />

                            {/* Content */}
                            <div className="absolute inset-0 z-30 flex items-center px-4 md:px-20">
                                <div className="max-w-3xl space-y-6 pt-20 animate-in fade-in slide-in-from-left-10 duration-1000">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-600/20 text-green-500 text-xs font-black uppercase tracking-[0.2em] border border-green-600/30 backdrop-blur-md">
                                        Tiêu điểm
                                    </div>

                                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white uppercase italic leading-[0.9] drop-shadow-2xl">
                                        {slider.title}
                                    </h1>

                                    {slider.description && (
                                        <p className="text-lg md:text-xl text-zinc-300 line-clamp-3 leading-relaxed max-w-xl italic drop-shadow-md">
                                            {slider.description}
                                        </p>
                                    )}

                                    {slider.linkUrl && (
                                        <div className="pt-4">
                                            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-black italic uppercase tracking-tighter rounded-full px-10 h-14 shadow-2xl shadow-green-900/40 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all" asChild>
                                                <Link href={slider.linkUrl}>
                                                    Khám Phá Ngay <ArrowRight className="ml-2 w-5 h-5" />
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}
