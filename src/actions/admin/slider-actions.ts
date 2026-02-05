"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getSliders() {
    try {
        const sliders = await db.slider.findMany({
            include: {
                movie: {
                    select: {
                        id: true,
                        title: true,
                        posterUrl: true
                    }
                }
            },
            orderBy: {
                order: 'asc'
            }
        })
        return sliders
    } catch (error) {
        console.error("Error fetching sliders:", error)
        return []
    }
}

export async function createSlider(formData: FormData) {
    try {
        const title = formData.get("title") as string
        const imageUrl = formData.get("imageUrl") as string
        const linkUrl = formData.get("linkUrl") as string
        const movieId = formData.get("movieId") as string
        const isActive = formData.get("isActive") === "true"

        if (!title) {
            return { success: false, error: "Tiêu đề là bắt buộc" }
        }

        // Either imageUrl or movieId must be provided
        if (!imageUrl && !movieId) {
            return { success: false, error: "Phải chọn hình ảnh hoặc phim để lấy poster" }
        }

        await db.slider.create({
            data: {
                title,
                imageUrl: imageUrl || null,
                linkUrl: linkUrl || null,
                movieId: movieId || null,
                isActive,
                order: 0
            }
        })

        revalidatePath("/admin/sliders")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Error creating slider:", error)
        return { success: false, error: "Không thể tạo slider" }
    }
}

export async function updateSlider(id: string, formData: FormData) {
    try {
        const title = formData.get("title") as string
        const imageUrl = formData.get("imageUrl") as string
        const linkUrl = formData.get("linkUrl") as string
        const movieId = formData.get("movieId") as string
        const isActive = formData.get("isActive") === "true"

        await db.slider.update({
            where: { id },
            data: {
                title,
                imageUrl: imageUrl || null,
                linkUrl: linkUrl || null,
                movieId: movieId || null,
                isActive
            }
        })

        revalidatePath("/admin/sliders")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Cập nhật slider thất bại" }
    }
}

export async function deleteSlider(id: string) {
    try {
        await db.slider.delete({
            where: { id }
        })
        revalidatePath("/admin/sliders")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Xóa slider thất bại" }
    }
}

export async function toggleSliderActive(id: string, currentState: boolean) {
    try {
        await db.slider.update({
            where: { id },
            data: { isActive: !currentState }
        })
        revalidatePath("/admin/sliders")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Cập nhật trạng thái thất bại" }
    }
}

export async function getMoviesForSlider() {
    try {
        const movies = await db.movie.findMany({
            where: {
                status: 'NOW_SHOWING'
            },
            select: {
                id: true,
                title: true,
                posterUrl: true
            },
            orderBy: {
                title: 'asc'
            }
        })
        return movies
    } catch (error) {
        console.error("Error fetching movies:", error)
        return []
    }
}
