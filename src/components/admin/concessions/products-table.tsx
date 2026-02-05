"use client"

import { useState, useTransition } from "react"
import {
    Edit2,
    Trash2,
    Plus,
    MoreHorizontal,
    Image as ImageIcon,
    Loader2,
    Search,
    Filter
} from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { createProduct, updateProduct, deleteProduct } from "@/actions/admin/product-actions"
import { ImageUpload } from "@/components/ui/image-upload"
import { DeleteAlertDialog } from "@/components/admin/delete-alert-dialog"

interface Category {
    id: string
    name: string
}

interface Product {
    id: string
    name: string
    price: number
    description: string | null
    categoryId: string | null
    category: Category | null
    image: string | null
    isAvailable: boolean
}

export function ProductsTable({
    products,
    categories = [],
    mode = "table"
}: {
    products: Product[],
    categories?: Category[],
    mode?: "table" | "add-trigger"
}) {
    const [isPending, startTransition] = useTransition()
    const [isOpen, setIsOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("ALL")

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "ALL" || product.categoryId === categoryFilter
        return matchesSearch && matchesCategory
    })

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        categoryId: "",
        description: "",
        image: "",
        isAvailable: true
    })

    const resetForm = () => {
        setFormData({
            name: "",
            price: "",
            categoryId: categories[0]?.id || "",
            description: "",
            image: "",
            isAvailable: true
        })
        setEditingProduct(null)
    }

    const handleOpenAdd = () => {
        resetForm()
        setIsOpen(true)
    }

    const handleOpenEdit = (product: Product) => {
        setEditingProduct(product)
        setFormData({
            name: product.name,
            price: product.price.toString(),
            categoryId: product.categoryId || "",
            description: product.description || "",
            image: product.image || "",
            isAvailable: product.isAvailable
        })
        setIsOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        startTransition(async () => {
            const productData = {
                name: formData.name,
                price: Number(formData.price),
                categoryId: formData.categoryId,
                description: formData.description,
                image: formData.image,
                isAvailable: formData.isAvailable
            }

            const result = editingProduct
                ? await updateProduct(editingProduct.id, productData)
                : await createProduct(productData)

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(result.success)
                setIsOpen(false)
                resetForm()
            }
        })
    }

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState<string | null>(null)

    const handleDeleteClick = (id: string) => {
        setProductToDelete(id)
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        if (!productToDelete) return

        startTransition(async () => {
            const result = await deleteProduct(productToDelete)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(result.success)
                setDeleteDialogOpen(false)
            }
        })
    }

    return (
        <>
            {mode === "add-trigger" ? (
                <Button onClick={handleOpenAdd} className="bg-green-600 hover:bg-green-700 text-white font-black rounded-full px-6 h-12 shadow-lg shadow-green-900/20 gap-2">
                    <Plus className="w-5 h-5" /> THÊM SẢN PHẨM
                </Button>
            ) : (
                <div className="space-y-4">
                    {/* Filters Bar */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6 bg-zinc-950/30 p-4 rounded-2xl border border-white/5">
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-green-500 transition-colors" />
                            <Input
                                placeholder="Tìm kiếm sản phẩm theo tên..."
                                className="pl-10 bg-zinc-900 border-zinc-800 focus:ring-green-500/20 focus:border-green-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest mr-2">
                                <Filter className="w-3 h-3" /> Lọc:
                            </div>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-full md:w-[200px] bg-zinc-900 border-zinc-800">
                                    <SelectValue placeholder="Danh mục" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                    <SelectItem value="ALL">Tất cả sản phẩm</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Table>
                        <TableHeader className="bg-zinc-950/50">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="w-[80px]">Ảnh</TableHead>
                                <TableHead className="font-bold text-zinc-400">Tên sản phẩm</TableHead>
                                <TableHead className="font-bold text-zinc-400 text-center">Danh mục</TableHead>
                                <TableHead className="font-bold text-zinc-400">Giá bán</TableHead>
                                <TableHead className="font-bold text-zinc-400">Trạng thái</TableHead>
                                <TableHead className="w-[100px] text-right font-bold text-zinc-400">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map((product) => (
                                <TableRow key={product.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                    <TableCell>
                                        <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/5 overflow-hidden flex items-center justify-center">
                                            {product.image ? (
                                                <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                                            ) : (
                                                <ImageIcon className="w-5 h-5 text-zinc-600" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-black text-white italic lowercase tracking-tight">{product.name}</p>
                                        <p className="text-xs text-zinc-500 line-clamp-1 italic">{product.description}</p>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${product.category?.name === 'Combo'
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                            : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                                            }`}>
                                            {product.category?.name || "Chưa phân loại"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-black text-zinc-100 italic">
                                        {product.price.toLocaleString('vi-VN')} đ
                                    </TableCell>
                                    <TableCell>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${product.isAvailable
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                            : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                                            }`}>
                                            {product.isAvailable ? 'Đang bán' : 'Hết hàng'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-800 text-zinc-400">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800 text-zinc-300">
                                                <DropdownMenuItem onClick={() => handleOpenEdit(product)} className="focus:bg-zinc-900 focus:text-white cursor-pointer">
                                                    <Edit2 className="w-4 h-4 mr-2" /> Chỉnh sửa
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteClick(product.id)} className="text-green-500 focus:bg-green-500/10 focus:text-green-500 cursor-pointer">
                                                    <Trash2 className="w-4 h-4 mr-2" /> Xóa
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredProducts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-zinc-500 font-bold italic">
                                        Chưa có sản phẩm nào.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase">
                            {editingProduct ? "Cập nhật" : "Thêm"} <span className="text-green-600">Sản Phẩm</span>
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 italic">
                            Điền thông tin chi tiết cho món bắp nước hoặc combo mới.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Tên sản phẩm</Label>
                                <Input
                                    id="name"
                                    className="bg-zinc-900 border-zinc-800 focus:ring-green-500"
                                    placeholder="Vd: Bắp Lớn Phô Mai"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Giá bán (VNĐ)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    className="bg-zinc-900 border-zinc-800 focus:ring-green-500"
                                    placeholder="Vd: 79000"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Phân loại</Label>
                            <Select
                                value={formData.categoryId}
                                onValueChange={(v) => setFormData({ ...formData, categoryId: v })}
                            >
                                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                    <SelectValue placeholder="Chọn loại sản phẩm" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Ảnh sản phẩm</Label>
                            <ImageUpload
                                value={formData.image || ""}
                                onChange={(url) => setFormData({ ...formData, image: url })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="desc" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Mô tả ngắn</Label>
                            <Input
                                id="desc"
                                className="bg-zinc-900 border-zinc-800 focus:ring-green-500 italic"
                                placeholder="Vd: Giòn tan vị phô mai"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center space-x-2 bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                            <input
                                type="checkbox"
                                id="isAvailable"
                                className="w-5 h-5 rounded border-zinc-800 bg-zinc-900 text-green-600 focus:ring-green-500"
                                checked={formData.isAvailable}
                                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                            />
                            <Label htmlFor="isAvailable" className="font-bold text-sm cursor-pointer">Sản phẩm đang kinh doanh</Label>
                        </div>

                        <DialogFooter className="pt-4 gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsOpen(false)}
                                className="font-bold text-zinc-400 hover:text-white"
                            >
                                HỦY BỎ
                            </Button>
                            <Button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white font-black px-8 h-12 rounded-xl flex-1 shadow-lg shadow-green-900/20"
                                disabled={isPending}
                            >
                                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingProduct ? "CẬP NHẬT" : "XÁC NHẬN")}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>


            <DeleteAlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                isDeleting={isPending}
                title="Xác nhận xóa sản phẩm"
                description="Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác."
            />
        </>
    )
}
