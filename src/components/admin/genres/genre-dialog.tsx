"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createGenre, updateGenre } from "@/actions/genres"
import { useRouter } from "next/navigation"

interface GenreDialogProps {
    mode: "create" | "edit"
    genre?: {
        id: string
        name: string
        slug: string
    }
}

export function GenreDialog({ mode, genre }: GenreDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)

        let result
        if (mode === "create") {
            result = await createGenre(formData)
        } else {
            if (!genre?.id) return
            result = await updateGenre(genre.id, formData)
        }

        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(result.success)
            setOpen(false)
            router.refresh()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {mode === "create" ? (
                    <Button className="bg-green-600 hover:bg-green-700 text-white font-bold gap-2">
                        <Plus className="w-4 h-4" /> Thêm thể loại
                    </Button>
                ) : (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                        <Pencil className="w-4 h-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Thêm thể loại mới" : "Chỉnh sửa thể loại"}</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Điền thông tin chi tiết cho thể loại phim.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-zinc-300">Tên thể loại</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={genre?.name}
                            placeholder="Ví dụ: Hành động"
                            className="bg-zinc-950 border-zinc-800 text-white"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug" className="text-zinc-300">Slug (Đường dẫn)</Label>
                        <Input
                            id="slug"
                            name="slug"
                            defaultValue={genre?.slug}
                            placeholder="Ví dụ: hanh-dong"
                            className="bg-zinc-950 border-zinc-800 text-white"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white bg-transparent">
                            Hủy
                        </Button>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mode === "create" ? "Thêm mới" : "Lưu thay đổi"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
