"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function createMovie(data: any) {
    try {
        const movie = await db.movie.create({
            data: {
                title: data.title,
                description: data.description,
                duration: Number(data.duration),
                posterUrl: data.posterUrl || null,
                trailerUrl: data.trailerUrl,
                releaseDate: new Date(data.releaseDate),
                rating: Number(data.rating),
                ageRating: data.ageRating,
                status: data.status || "COMING_SOON",
                country: data.country,
                directorId: data.directorId || null,
                cast: {
                    create: data.cast?.map((member: any) => ({
                        personId: member.personId,
                        characterName: member.characterName || ""
                    })) || []
                },
                genres: {
                    create: data.genreIds?.map((id: string) => ({
                        genre: { connect: { id } }
                    })) || []
                }
            }
        })

        revalidatePath("/admin/movies")
        revalidatePath("/") // Homepage featured movies
        return { success: "Đã thêm phim mới thành công!", movie }
    } catch (error: any) {
        console.error("CREATE_MOVIE_ERROR:", error.message || error)
        return { error: `Lỗi khi tạo phim: ${error.message || "Vui lòng thử lại"}` }
    }
}

export async function updateMovie(id: string, data: any) {
    try {
        const movie = await db.$transaction(async (tx: any) => {
            // 1. Delete existing cast to sync
            await tx.movieCast.deleteMany({
                where: { movieId: id }
            })

            // 1.1 Delete existing genres to sync
            await tx.movieGenre.deleteMany({
                where: { movieId: id }
            })

            // 2. Update movie
            return await tx.movie.update({
                where: { id },
                data: {
                    title: data.title,
                    description: data.description,
                    duration: Number(data.duration),
                    posterUrl: data.posterUrl || null,
                    trailerUrl: data.trailerUrl,
                    releaseDate: new Date(data.releaseDate),
                    rating: Number(data.rating),
                    ageRating: data.ageRating,
                    status: data.status || "COMING_SOON",
                    country: data.country,
                    directorId: data.directorId || null,
                    cast: {
                        create: data.cast?.map((member: any) => ({
                            personId: member.personId,
                            characterName: member.characterName || ""
                        })) || []
                    },
                    genres: {
                        create: data.genreIds?.map((id: string) => ({
                            genre: { connect: { id } }
                        })) || []
                    }
                }
            })
        })

        revalidatePath("/admin/movies")
        revalidatePath(`/movie/${id}`)
        revalidatePath("/")
        return { success: "Đã cập nhật thông tin phim!", movie }
    } catch (error: any) {
        console.error("UPDATE_MOVIE_ERROR:", error.message || error)
        return { error: `Lỗi khi cập nhật: ${error.message || "Vui lòng thử lại"}` }
    }
}

export async function deleteMovie(id: string) {
    try {
        const session = await auth()
        if (!session || !session.user || session.user.role !== "ADMIN") {
            return { error: "Bạn không có quyền thực hiện thao tác này." }
        }

        // 1. Check if movie has any bookings
        const existingBookings = await db.booking.findFirst({
            where: {
                showtime: {
                    movieId: id
                }
            }
        })

        if (existingBookings) {
            return { error: "Không thể xóa phim này vì đã có vé được đặt." }
        }

        // 2. Delete related data manually (simulating cascade)
        await db.$transaction([
            // Delete Cast
            db.movieCast.deleteMany({ where: { movieId: id } }),
            // Delete Genres (if relation exists)
            db.movieGenre.deleteMany({ where: { movieId: id } }),
            // Delete Showtimes
            db.showtime.deleteMany({ where: { movieId: id } }),
            // Delete Movie
            db.movie.delete({ where: { id } })
        ])

        revalidatePath("/admin/movies")
        revalidatePath("/")
        return { success: "Đã xóa phim và các dữ liệu liên quan thành công!" }
    } catch (error) {
        console.error("Failed to delete movie:", error)
        return { error: "Lỗi hệ thống: Không thể xóa phim." }
    }
}
