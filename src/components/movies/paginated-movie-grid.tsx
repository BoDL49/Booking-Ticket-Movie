"use client"

import { useState } from "react"
import { MovieCard } from "@/components/movies/movie-card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Movie {
    id: string
    title: string
    posterUrl: string
    genres?: { genre: { name: string } }[]
    rating: number
    ageRating: string
}

export function PaginatedMovieGrid({ movies }: { movies: Movie[] }) {
    const [currentPage, setCurrentPage] = useState(0)
    const moviesPerPage = 5
    const totalPages = Math.ceil(movies.length / moviesPerPage)

    const startIndex = currentPage * moviesPerPage
    const endIndex = startIndex + moviesPerPage
    const currentMovies = movies.slice(startIndex, endIndex)

    const goToNextPage = () => {
        // Loop back to first page if at the end
        setCurrentPage((currentPage + 1) % totalPages)
    }

    const goToPrevPage = () => {
        // Loop to last page if at the beginning
        setCurrentPage(currentPage === 0 ? totalPages - 1 : currentPage - 1)
    }

    if (totalPages <= 1) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
                {currentMovies.map((movie: any) => (
                    <MovieCard
                        key={movie.id}
                        id={movie.id}
                        title={movie.title}
                        posterUrl={movie.posterUrl}
                        genre={movie.genres?.[0]?.genre?.name || "Hành động"}
                        rating={movie.rating}
                        ageRating={movie.ageRating}
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Grid layout with navigation buttons on same row */}
            <div className="relative grid grid-cols-[48px_1fr_48px] items-center gap-6">
                {/* Left Arrow Button */}
                <button
                    onClick={goToPrevPage}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all group"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </button>

                {/* Movie Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
                    {currentMovies.map((movie: any) => (
                        <MovieCard
                            key={movie.id}
                            id={movie.id}
                            title={movie.title}
                            posterUrl={movie.posterUrl}
                            genre={movie.genres?.[0]?.genre?.name || "Hành động"}
                            rating={movie.rating}
                            ageRating={movie.ageRating}
                        />
                    ))}
                </div>

                {/* Right Arrow Button */}
                <button
                    onClick={goToNextPage}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all group"
                    aria-label="Next page"
                >
                    <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </button>
            </div>

            {/* Dot Indicators */}
            <div className="flex items-center justify-center gap-2 pt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`transition-all rounded-full ${i === currentPage
                            ? "w-8 h-2 bg-white"
                            : "w-2 h-2 bg-white/40 hover:bg-white/60"
                            }`}
                        aria-label={`Go to page ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
