"use client"

import { useState, useTransition } from "react"
import {
    Edit2,
    Trash2,
    Plus,
    MoreHorizontal,
    User,
    Loader2,
    Search
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
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ui/image-upload"
import { toast } from "sonner"
import { createActor, updateActor, deleteActor } from "@/actions/admin/actor-actions"
import { DeleteAlertDialog } from "@/components/admin/delete-alert-dialog"

interface Actor {
    id: string
    name: string
    bio: string | null
    avatarUrl: string | null
}

export function ActorsTable({
    actors,
    mode = "table"
}: {
    actors: Actor[],
    mode?: "table" | "add-trigger"
}) {
    const [isPending, startTransition] = useTransition()
    const [isOpen, setIsOpen] = useState(false)
    const [editingActor, setEditingActor] = useState<Actor | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    const filteredActors = actors.filter(actor =>
        actor.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        avatarUrl: ""
    })

    const resetForm = () => {
        setFormData({
            name: "",
            bio: "",
            avatarUrl: ""
        })
        setEditingActor(null)
    }

    const handleOpenAdd = () => {
        resetForm()
        setIsOpen(true)
    }

    const handleOpenEdit = (actor: Actor) => {
        setEditingActor(actor)
        setFormData({
            name: actor.name,
            bio: actor.bio || "",
            avatarUrl: actor.avatarUrl || ""
        })
        setIsOpen(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        startTransition(async () => {
            const result = editingActor
                ? await updateActor(editingActor.id, formData)
                : await createActor(formData)

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
    const [actorToDelete, setActorToDelete] = useState<string | null>(null)

    const handleDeleteClick = (id: string) => {
        setActorToDelete(id)
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        if (!actorToDelete) return

        startTransition(async () => {
            const result = await deleteActor(actorToDelete)
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
                    <Plus className="w-5 h-5" /> THÊM DIỄN VIÊN
                </Button>
            ) : (
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6 bg-zinc-950/30 p-4 rounded-2xl border border-white/5">
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-green-500 transition-colors" />
                            <Input
                                placeholder="Tìm kiếm theo tên diễn viên..."
                                className="pl-10 bg-zinc-900 border-zinc-800 focus:ring-green-500/20 focus:border-green-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <Table>
                        <TableHeader className="bg-zinc-950/50">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="w-[80px]">Ảnh</TableHead>
                                <TableHead className="font-bold text-zinc-400">Tên diễn viên</TableHead>
                                <TableHead className="font-bold text-zinc-400">Tiểu sử</TableHead>
                                <TableHead className="w-[100px] text-right font-bold text-zinc-400">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredActors.map((actor) => (
                                <TableRow key={actor.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                    <TableCell>
                                        <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/5 overflow-hidden flex items-center justify-center">
                                            {actor.avatarUrl ? (
                                                <img src={actor.avatarUrl} className="w-full h-full object-cover" alt={actor.name} />
                                            ) : (
                                                <User className="w-5 h-5 text-zinc-600" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-black text-white italic lowercase tracking-tight">{actor.name}</p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-xs text-zinc-500 line-clamp-1 italic">{actor.bio || "Chưa có thông tin"}</p>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-800 text-zinc-400">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800 text-zinc-300">
                                                <DropdownMenuItem onClick={() => handleOpenEdit(actor)} className="focus:bg-zinc-900 focus:text-white cursor-pointer">
                                                    <Edit2 className="w-4 h-4 mr-2" /> Chỉnh sửa
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteClick(actor.id)} className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer">
                                                    <Trash2 className="w-4 h-4 mr-2" /> Xóa
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase">
                            {editingActor ? "Cập nhật" : "Thêm"} <span className="text-green-600">Diễn Viên</span>
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 italic">
                            Nhập thông tin chi tiết về diễn viên để hiển thị trên website.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Ảnh đại diện</Label>
                                <ImageUpload
                                    value={formData.avatarUrl}
                                    onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Tên diễn viên</Label>
                                <Input
                                    id="name"
                                    className="bg-zinc-900 border-zinc-800 focus:ring-green-500"
                                    placeholder="Vd: Quách Ngọc Ngoan"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Tiểu sử</Label>
                                <Textarea
                                    id="bio"
                                    rows={4}
                                    className="bg-zinc-900 border-zinc-800 focus:ring-green-500 italic"
                                    placeholder="Mô tả ngắn về diễn viên..."
                                    value={formData.bio}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>
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
                                disabled={isPending}
                                className="bg-green-600 hover:bg-green-700 text-white font-black px-8 rounded-full shadow-lg shadow-green-900/20"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingActor ? "CẬP NHẬT NGAY" : "THÊM DIỄN VIÊN")}
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
                title="Xác nhận xóa diễn viên"
                description="Bạn có chắc chắn muốn xóa diễn viên này không? Hành động này không thể hoàn tác."
            />
        </>
    )
}
