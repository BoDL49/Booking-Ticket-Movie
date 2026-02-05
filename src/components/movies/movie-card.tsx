import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface MovieProps {
    id: string
    title: string
    posterUrl: string | null
    genre: string
    rating: number | null
    ageRating: string
}

export function MovieCard({ id, title, posterUrl, genre, rating, ageRating }: MovieProps) {
    // Determine color for age rating
    const getRatingColor = (rating: string) => {
        switch (rating) {
            case 'P': return 'bg-green-500'
            case 'K': return 'bg-blue-500'
            case 'C13': return 'bg-yellow-500'
            case 'C16': return 'bg-orange-500'
            case 'C18': return 'bg-red-600'
            default: return 'bg-zinc-500'
        }
    }

    return (
        <Link href={`/movie/${id}`} className="group relative block w-full space-y-3">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                {posterUrl ? (
                    <Image
                        src={posterUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-zinc-700">No Image</div>
                )}

                {/* Badges Overlay */}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${getRatingColor(ageRating)}`}>
                        {ageRating}
                    </span>
                </div>

                <div className="absolute top-2 right-2">
                    <Badge className="bg-zinc-900/80 hover:bg-zinc-900 border-white/20 backdrop-blur-md text-[10px] px-1.5 py-0.5 h-auto">
                        2D
                    </Badge>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 pt-12 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Đặt Vé
                    </Button>
                </div>
            </div>

            <div className="space-y-1">
                <h3 className="text-lg font-bold leading-tight text-white group-hover:text-green-500 transition-colors truncate">
                    {title}
                </h3>
                <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>{genre}</span>
                    <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-3 w-3 fill-yellow-500" />
                        <span className="font-bold">{rating}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
