"use client"

import { useState, useTransition } from "react"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MoreHorizontal, Pencil, Trash2, Plus, Loader2 } from "lucide-react"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { createCategory, updateCategory, deleteCategory } from "@/actions/admin/category-actions"
import { DeleteAlertDialog } from "@/components/admin/delete-alert-dialog"

interface Category {
    id: string
    name: string
    description: string | null
    _count?: {
        products: number
    }
}

export function CategoriesTable({ categories }: { categories: Category[] }) {
    const [isPending, startTransition] = useTransition()
    const [isOpen, setIsOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const name = formData.get("name") as string
        const description = formData.get("description") as string

        startTransition(async () => {
            const result = editingCategory
                ? await updateCategory(editingCategory.id, { name, description })
                : await createCategory({ name, description })

            if (result.success) {
                toast.success(editingCategory ? "Đã cập nhật danh mục" : "Đã thêm danh mục mới")
                setIsOpen(false)
                setEditingCategory(null)
            } else {
                toast.error(result.error)
            }
        })
    }

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

    const handleDeleteClick = (id: string) => {
        setCategoryToDelete(id)
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        if (!categoryToDelete) return

        startTransition(async () => {
            const result = await deleteCategory(categoryToDelete)
            if (result.success) {
                toast.success("Đã xóa danh mục")
                setDeleteDialogOpen(false)
            } else {
                toast.error(result.error)
            }
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5">
                <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">Danh mục bắp nước</h2>
                <Dialog open={isOpen} onOpenChange={(open) => {
                    setIsOpen(open)
                    if (!open) setEditingCategory(null)
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-full gap-2 px-6">
                            <Plus className="w-4 h-4" /> Thêm danh mục
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">
                                {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-zinc-400 uppercase text-xs font-black tracking-widest">Tên danh mục</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={editingCategory?.name}
                                    className="bg-zinc-900 border-zinc-800 focus:border-red-600 transition-colors"
                                    placeholder="VD: Bắp Rang, Nước Ngọt..."
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-zinc-400 uppercase text-xs font-black tracking-widest">Mô tả</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={editingCategory?.description || ""}
                                    className="bg-zinc-900 border-zinc-800 focus:border-red-600 transition-colors min-h-[100px]"
                                    placeholder="Mô tả ngắn gọn về danh mục này..."
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black italic uppercase tracking-tighter py-6"
                                >
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingCategory ? "Cập nhật" : "Tạo danh mục")}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableHeader className="bg-zinc-950/50">
                    <TableRow className="border-white/5 hover:bg-transparent">
                        <TableHead className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest px-6 italic">Tên danh mục</TableHead>
                        <TableHead className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest italic">Mô tả</TableHead>
                        <TableHead className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest text-center italic">Sản phẩm</TableHead>
                        <TableHead className="w-[80px] px-6"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map((category) => (
                        <TableRow key={category.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                            <TableCell className="px-6">
                                <span className="font-bold text-white italic group-hover:text-red-500 transition-colors">{category.name}</span>
                            </TableCell>
                            <TableCell className="text-zinc-500 text-sm truncate max-w-[300px] italic">
                                {category.description || "---"}
                            </TableCell>
                            <TableCell className="text-center font-black italic text-zinc-400">
                                {category._count?.products || 0}
                            </TableCell>
                            <TableCell className="px-6">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-800 rounded-full">
                                            <MoreHorizontal className="h-4 w-4 text-zinc-500" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white">
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setEditingCategory(category)
                                                setIsOpen(true)
                                            }}
                                            className="focus:bg-red-600 cursor-pointer gap-2"
                                        >
                                            <Pencil className="w-4 h-4" /> Chỉnh sửa
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleDeleteClick(category.id)}
                                            className="focus:bg-red-600 text-red-500 focus:text-white cursor-pointer gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" /> Xóa
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    {categories.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="h-32 text-center text-zinc-600 italic">
                                Chưa có danh mục nào.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <DeleteAlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                isDeleting={isPending}
                title="Xác nhận xóa danh mục"
                description="Bạn có chắc chắn muốn xóa danh mục này không? Hành động này sẽ xóa các sản phẩm bên trong."
            />
        </div>
    )
}
