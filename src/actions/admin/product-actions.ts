"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createProduct(data: {
    name: string
    price: number
    description: string
    categoryId: string
    image: string
    isAvailable: boolean
}) {
    try {
        // Fetch category name for legacy fallback
        const categoryObj = await db.productCategory.findUnique({
            where: { id: data.categoryId }
        })

        await db.product.create({
            data: {
                name: data.name,
                price: Number(data.price),
                description: data.description,
                categoryId: data.categoryId,
                legacyCategory: categoryObj?.name || null,
                image: data.image || null,
                isAvailable: data.isAvailable
            }
        })
        revalidatePath("/admin/concessions")
        revalidatePath("/concessions")
        revalidatePath("/")
        return { success: "Đã thêm sản phẩm mới!" }
    } catch (error: any) {
        console.error("CREATE_PRODUCT_ERROR:", error.message || error)
        return { error: `Lỗi khi thêm sản phẩm: ${error.message || "Vui lòng thử lại"}` }
    }
}

export async function updateProduct(id: string, data: {
    name: string
    price: number
    description: string
    categoryId: string
    image: string
    isAvailable: boolean
}) {
    try {
        const categoryObj = await db.productCategory.findUnique({
            where: { id: data.categoryId }
        })

        await db.product.update({
            where: { id },
            data: {
                name: data.name,
                price: Number(data.price),
                description: data.description,
                categoryId: data.categoryId,
                legacyCategory: categoryObj?.name || null,
                image: data.image || null,
                isAvailable: data.isAvailable
            }
        })
        revalidatePath("/admin/concessions")
        revalidatePath("/concessions")
        revalidatePath("/")
        return { success: "Đã cập nhật sản phẩm!" }
    } catch (error: any) {
        console.error("UPDATE_PRODUCT_ERROR:", error.message || error)
        return { error: `Lỗi khi cập nhật sản phẩm: ${error.message || "Vui lòng thử lại"}` }
    }
}

export async function deleteProduct(id: string) {
    try {
        await db.product.delete({
            where: { id }
        })
        revalidatePath("/admin/concessions")
        revalidatePath("/concessions")
        revalidatePath("/")
        return { success: "Đã xóa sản phẩm!" }
    } catch (error) {
        return { error: "Không thể xóa sản phẩm. Có thể sản phẩm này đã được bán." }
    }
}
