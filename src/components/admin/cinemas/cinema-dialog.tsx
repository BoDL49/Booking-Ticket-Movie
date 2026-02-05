"use client"

import { useState, useTransition } from "react"
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
import { Loader2, Plus, Pencil, Building2 } from "lucide-react"
import { createCinema, updateCinema } from "@/actions/admin/cinema-actions"
import { toast } from "sonner"
import { ImageUpload } from "@/components/ui/image-upload"

interface Cinema {
    id: string
    name: string
    address: string | null
    imageUrl?: string | null
}

interface CinemaDialogProps {
    mode?: "create" | "edit"
    cinema?: Cinema
    trigger?: React.ReactNode
}

export function CinemaDialog({ mode = "create", cinema, trigger }: CinemaDialogProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState({
        name: cinema?.name || "",
        address: cinema?.address || "",
        imageUrl: cinema?.imageUrl || ""
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            const result = mode === 'edit' && cinema
                ? await updateCinema(cinema.id, formData)
                : await createCinema(formData)

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(result.success)
                setOpen(false)
                if (mode === 'create') {
                    setFormData({ name: "", address: "", imageUrl: "" })
                }
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? trigger : (
                    <Button className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-full shadow-lg shadow-green-900/20 gap-2">
                        <Plus className="w-4 h-4" /> Thêm Chi Nhánh
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-green-500" />
                        {mode === 'edit' ? 'Cập Nhật Chi Nhánh' : 'Thêm Chi Nhánh Mới'}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Nhập thông tin chi tiết về rạp chiếu phim để hiển thị trên hệ thống.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Tên Rạp</Label>
                        <Input
                            id="name"
                            placeholder="Vd: BơCinema Center Point"
                            className="bg-zinc-900 border-zinc-800 focus:ring-green-500"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Địa chỉ</Label>
                        <Input
                            id="address"
                            placeholder="Vd: 123 Đường ABC, Quận XYZ, TP.HCM"
                            className="bg-zinc-900 border-zinc-800 focus:ring-green-500"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Hình ảnh / Logo Rạp</Label>
                        <ImageUpload
                            value={formData.imageUrl}
                            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white">
                            Hủy bỏ
                        </Button>
                        <Button type="submit" disabled={isPending} className="bg-green-600 hover:bg-green-700 text-white font-bold">
                            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {mode === 'edit' ? 'Lưu Thay Đổi' : 'Tạo Chi Nhánh'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
