import { db } from "@/lib/db"
import { MOCK_MOVIES } from "@/lib/mock-data"

export async function getNowShowingMovies() {
    try {
        const movies = await db.movie.findMany({
            where: { status: "NOW_SHOWING" },
            take: 10,
            orderBy: { releaseDate: 'desc' },
            include: {
                genres: { include: { genre: true } }
            }
        })

        if (movies.length === 0) return MOCK_MOVIES
        return movies
    } catch (error) {
        console.warn("Database lookup failed, returning mock data:", error)
        return MOCK_MOVIES
    }
}

export async function getComingSoonMovies() {
    try {
        const movies = await db.movie.findMany({
            where: { status: "COMING_SOON" },
            orderBy: { releaseDate: 'asc' },
            include: {
                genres: { include: { genre: true } }
            }
        })
        return movies
    } catch (error) {
        console.warn("Database lookup failed for coming soon movies:", error)
        return []
    }
}

export async function getMovieById(id: string) {
    if (!id) return null
    if (id.startsWith("movie-")) {
        return MOCK_MOVIES.find(m => m.id === id) || null
    }

    try {
        return await db.movie.findUnique({
            where: { id },
            include: {
                genres: { include: { genre: true } },
                director: true,
                cast: { include: { person: true } },
                showtimes: {
                    include: {
                        hall: {
                            include: { cinema: true }
                        }
                    },
                    orderBy: { startTime: 'asc' }
                }
            }
        })
    } catch (error) {
        console.warn("Database lookup failed return mock for id:", id)
        // Return mostly empty structure or basic info from mock if found
        return MOCK_MOVIES.find(m => m.id === id) || null
    }
}

export async function getShowtimeDetails(showtimeId: string) {
    if (!showtimeId) return null

    try {
        // 1. Get Showtime Info (Movie, Hall, Price)
        const showtime = await db.showtime.findUnique({
            where: { id: showtimeId },
            include: {
                movie: true,
                hall: true
            }
        })

        if (!showtime) return null

        // 2. Get All Seats in Hall
        const allSeats = await db.seat.findMany({
            where: { hallId: showtime.hallId },
            orderBy: [{ row: 'asc' }, { number: 'asc' }]
        })

        // 3. Get Booked Seats for this Showtime
        const bookings = await db.booking.findMany({
            where: {
                showtimeId: showtimeId,
                status: { not: 'CANCELLED' }
            },
            include: {
                items: {
                    where: { seatId: { not: null } }
                }
            }
        })

        // Flatten booked seat IDs
        const bookedSeatIds = new Set(
            bookings.flatMap((b: any) => b.items.map((i: any) => i.seatId))
        )

        // 4. Merge Data
        const seatsWithStatus = allSeats.map((seat: any) => ({
            ...seat,
            status: bookedSeatIds.has(seat.id) ? 'OCCUPIED' : 'AVAILABLE',
            price: showtime.basePrice + (seat.type === 'VIP' ? 20000 : (seat.type === 'COUPLE' ? 50000 : 0)) // Simple pricing rule
        }))

        return {
            showtime,
            seats: seatsWithStatus
        }

    } catch (error) {
        console.error("Error fetching showtime details:", error)
        return null
    }
}

export async function getAllMovies(search?: string, genre?: string, status: string = "NOW_SHOWING") {
    try {
        const where: any = {
            status: status
        }

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } }
            ]
        }

        if (genre) {
            where.genres = {
                some: {
                    genre: {
                        slug: genre
                    }
                }
            }
        }

        const movies = await db.movie.findMany({
            where,
            orderBy: { releaseDate: status === "NOW_SHOWING" ? 'desc' : 'asc' },
            include: {
                genres: { include: { genre: true } }
            }
        })

        return movies
    } catch (error) {
        console.error("Error fetching all movies:", error)
        return []
    }
}

export async function getAllGenres() {
    try {
        return await db.genre.findMany({
            orderBy: { name: 'asc' }
        })
    } catch (error) {
        console.error("Error fetching genres:", error)
        return []
    }
}

export async function getUserBookings(userId: string) {
    if (!userId) return []

    try {
        return await db.booking.findMany({
            where: { userId },
            include: {
                showtime: {
                    include: {
                        movie: true,
                        hall: true
                    }
                },
                items: {
                    include: {
                        seat: true,
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
    } catch (error) {
        console.error("Error fetching user bookings:", error)
        return []
    }
}

export async function getAllProducts() {
    try {
        const products = await db.product.findMany({
            orderBy: { price: 'asc' }
        })
        if (products.length === 0) {
            // Import dynamically to avoid circle issues if any, or just use the local import
            const { MOCK_PRODUCTS } = await import("@/lib/mock-products")
            return MOCK_PRODUCTS
        }
        return products
    } catch (error) {
        const { MOCK_PRODUCTS } = await import("@/lib/mock-products")
        return MOCK_PRODUCTS
    }
}

export async function getAllCinemas() {
    try {
        return await db.cinema.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { halls: true }
                }
            }
        })
    } catch (error) {
        console.error("Error fetching cinemas:", error)
        return []
    }
}

export async function getCinemaById(id: string) {
    if (!id) return null
    try {
        // Find cinema
        const cinema = await db.cinema.findUnique({
            where: { id },
            include: {
                halls: true
            }
        })

        if (!cinema) return null

        // Find upcoming showtimes for this cinema
        // We find showtimes where hall.cinemaId = id
        const showtimes = await db.showtime.findMany({
            where: {
                hall: {
                    cinemaId: id
                },
                startTime: {
                    gte: new Date() // Only future showtimes
                }
            },
            include: {
                movie: true,
                hall: true
            },
            orderBy: { startTime: 'asc' }
        })

        return { ...cinema, showtimes }
    } catch (error) {
        console.error("Error fetching cinema details:", error)
        return null
    }
}
