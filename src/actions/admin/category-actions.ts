"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createCategory(formData: { name: string, description?: string }) {
    try {
        const category = await db.productCategory.create({
            data: {
                name: formData.name,
                description: formData.description
            }
        })
        revalidatePath("/admin/concessions")
        return { success: true, category }
    } catch (error: any) {
        return { error: error.message || "Failed to create category" }
    }
}

export async function updateCategory(id: string, formData: { name: string, description?: string }) {
    try {
        const category = await db.productCategory.update({
            where: { id },
            data: {
                name: formData.name,
                description: formData.description
            }
        })
        revalidatePath("/admin/concessions")
        return { success: true, category }
    } catch (error: any) {
        return { error: error.message || "Failed to update category" }
    }
}

export async function deleteCategory(id: string) {
    try {
        // Check if category has products
        const productsCount = await db.product.count({
            where: { categoryId: id }
        })

        if (productsCount > 0) {
            return { error: "Không thể xóa danh mục đang có sản phẩm. Vui lòng chuyển sản phẩm sang danh mục khác trước." }
        }

        await db.productCategory.delete({
            where: { id }
        })
        revalidatePath("/admin/concessions")
        return { success: true }
    } catch (error: any) {
        return { error: error.message || "Failed to delete category" }
    }
}

export async function getCategories() {
    return await db.productCategory.findMany({
        orderBy: { name: 'asc' }
    })
}
