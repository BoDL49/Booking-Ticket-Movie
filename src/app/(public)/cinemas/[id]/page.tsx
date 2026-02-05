import { getCinemaById } from "@/lib/data-service"
import { notFound } from "next/navigation"
import { MapPin, Film } from "lucide-react"
import { CinemaShowtimes } from "@/components/cinemas/cinema-showtimes"

export default async function CinemaDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const cinema = await getCinemaById(id)

    if (!cinema) {
        notFound()
    }

    // Cast showtimes to compatible type if needed (Prisma dates are Date objects, so it should match)
    // We might need to ensure the query in getCinemaById returns movie info with ageRating etc.
    // Checking getCinemaById in data-service... it includes movie: true.
    // The Movie model has ageRating, duration, posterUrl etc. So it should be fine.

    return (
        <div className="min-h-screen bg-black text-zinc-100 font-sans">
            {/* Hero Section */}
            <div className="relative h-[40vh] w-full overflow-hidden">
                {cinema.imageUrl ? (
                    <div className="absolute inset-0">
                        <img
                            src={cinema.imageUrl}
                            alt={cinema.name}
                            className="w-full h-full object-cover opacity-40 blur-sm scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/80 to-zinc-950/30" />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 to-zinc-950" />
                )}

                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10 mix-blend-overlay" />

                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />

                <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
                    <div className="flex items-start gap-6">
                        <div className="h-24 w-24 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl shadow-green-900/10 rotate-3 overflow-hidden">
                            {cinema.imageUrl ? (
                                <img src={cinema.imageUrl} alt={cinema.name} className="w-full h-full object-cover" />
                            ) : (
                                <Film className="w-12 h-12 text-green-600" />
                            )}
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
                                {cinema.name}
                            </h1>
                            <div className="flex items-center gap-2 text-zinc-400 text-lg">
                                <MapPin className="text-green-600 w-5 h-5" />
                                <span>{cinema.address || "Đang cập nhật địa chỉ"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 -mt-10 relative z-20">
                <CinemaShowtimes showtimes={cinema.showtimes as any} />
            </div>
        </div>
    )
}
