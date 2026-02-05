"use client"

import { useState, useTransition } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, MapPin, Plus, Trash2, Armchair, Loader2, Building2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { createHall, deleteHall, updateHall } from "@/actions/admin/hall-actions"
import { DeleteAlertDialog } from "@/components/admin/delete-alert-dialog"
import Link from "next/link"
import { Pencil } from "lucide-react"

interface Hall {
    id: string
    name: string
    totalSeats: number
    cinema?: { name: string } | null
    _count?: {
        seats: number
        showtimes: number
    }
}

interface Cinema {
    id: string
    name: string
}

export function HallsTable({ halls, cinemas }: { halls: Hall[], cinemas: Cinema[] }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [selectedCinemaId, setSelectedCinemaId] = useState<string>("")

    // Delete State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [hallToDelete, setHallToDelete] = useState<string | null>(null)

    // Edit State
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [hallToEdit, setHallToEdit] = useState<Hall | null>(null)

    // Filter Logic
    const filteredHalls = halls.filter(hall =>
        hall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hall.cinema?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const name = formData.get("name") as string
        const totalSeats = Number(formData.get("totalSeats"))
        const cinemaId = selectedCinemaId

        if (!cinemaId) {
            toast.error("Vui lòng chọn chi nhánh")
            return
        }

        startTransition(async () => {
            const result = await createHall({ name, totalSeats, cinemaId })
            if (result.success) {
                toast.success(result.success)
                setIsCreateOpen(false)
                setSelectedCinemaId("")
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleEditClick = (hall: Hall) => {
        setHallToEdit(hall)
        // Set selected cinema if it exists
        if (hall.cinema) {
            const cinema = cinemas.find(c => c.name === hall.cinema?.name)
            if (cinema) setSelectedCinemaId(cinema.id)
        } else {
            setSelectedCinemaId("")
        }
        setIsEditOpen(true)
    }

    const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!hallToEdit) return

        const formData = new FormData(e.currentTarget)
        const name = formData.get("name") as string
        const totalSeats = Number(formData.get("totalSeats"))
        const cinemaId = selectedCinemaId

        if (!cinemaId) {
            toast.error("Vui lòng chọn chi nhánh")
            return
        }

        startTransition(async () => {
            const result = await updateHall(hallToEdit.id, { name, totalSeats, cinemaId })
            if (result.success) {
                toast.success(result.success)
                setIsEditOpen(false)
                setHallToEdit(null)
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleDeleteClick = (id: string) => {
        setHallToDelete(id)
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        if (!hallToDelete) return

        startTransition(async () => {
            const result = await deleteHall(hallToDelete)
            if (result.success) {
                toast.success(result.success)
                setDeleteDialogOpen(false)
            } else {
                toast.error(result.error)
            }
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6 bg-zinc-950/30 p-4 rounded-2xl border border-white/5">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-green-500 transition-colors" />
                    <Input
                        placeholder="Tìm tên phòng hoặc chi nhánh..."
                        className="pl-10 bg-zinc-900 border-zinc-800 focus:ring-green-500/20 focus:border-green-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-900/20 gap-2">
                                <Plus className="w-4 h-4" /> Thêm Phòng Chiếu
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black italic uppercase">Thêm phòng chiếu mới</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateSubmit} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-zinc-400 font-bold uppercase text-xs">Tên phòng</Label>
                                    <Input id="name" name="name" placeholder="VD: Phòng IMAX 1" className="bg-zinc-900 border-zinc-800" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-400 font-bold uppercase text-xs">Chi nhánh</Label>
                                    <Select value={selectedCinemaId} onValueChange={setSelectedCinemaId} required>
                                        <SelectTrigger className="w-full bg-zinc-900 border-zinc-800">
                                            <SelectValue placeholder="Chọn chi nhánh" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                            {cinemas.map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="totalSeats" className="text-zinc-400 font-bold uppercase text-xs">Tổng số ghế</Label>
                                    <Input id="totalSeats" name="totalSeats" type="number" placeholder="VD: 100" className="bg-zinc-900 border-zinc-800" required />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={isPending} className="bg-green-600 hover:bg-green-700 text-white font-bold w-full">
                                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tạo mới"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] overflow-hidden shadow-xl">
                <Table>
                    <TableHeader className="bg-zinc-950/50">
                        <TableRow className="border-white/5 hover:bg-transparent">
                            <TableHead className="font-bold text-zinc-400 pl-6">Tên phòng</TableHead>
                            <TableHead className="font-bold text-zinc-400">Chi nhánh</TableHead>
                            <TableHead className="font-bold text-zinc-400 text-center">Sức chứa</TableHead>
                            <TableHead className="font-bold text-zinc-400 text-center">Số ghế</TableHead>
                            <TableHead className="font-bold text-zinc-400 text-right pr-6">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredHalls.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-zinc-500 font-bold italic">
                                    Không tìm thấy phòng chiếu nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredHalls.map((hall) => (
                                <TableRow key={hall.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                    <TableCell className="pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-zinc-800 overflow-hidden flex items-center justify-center border border-white/10">
                                                <MapPin className="w-5 h-5 text-zinc-500" />
                                            </div>
                                            <span className="font-bold text-white text-sm">{hall.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-zinc-400 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-3 h-3" />
                                            {hall.cinema?.name || <span className="text-yellow-500 font-bold text-xs px-2 py-0.5 bg-yellow-500/10 rounded">Chưa gán</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-white">
                                        {hall.totalSeats}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={`font-bold ${(hall._count?.seats || 0) < hall.totalSeats
                                            ? 'text-yellow-500'
                                            : 'text-green-500'
                                            }`}>
                                            {hall._count?.seats || 0}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/halls/${hall.id}/seats`}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-zinc-500 hover:text-blue-500 hover:bg-blue-500/10"
                                                    title="Sơ đồ ghế"
                                                >
                                                    <Armchair className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-zinc-500 hover:text-yellow-500 hover:bg-yellow-500/10"
                                                onClick={() => handleEditClick(hall)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-zinc-500 hover:text-green-500 hover:bg-green-500/10"
                                                onClick={() => handleDeleteClick(hall.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black italic uppercase">Cập nhật thông tin phòng</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name" className="text-zinc-400 font-bold uppercase text-xs">Tên phòng</Label>
                            <Input
                                id="edit-name"
                                name="name"
                                defaultValue={hallToEdit?.name}
                                className="bg-zinc-900 border-zinc-800"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-zinc-400 font-bold uppercase text-xs">Chi nhánh</Label>
                            <Select value={selectedCinemaId} onValueChange={setSelectedCinemaId} required>
                                <SelectTrigger className="w-full bg-zinc-900 border-zinc-800">
                                    <SelectValue placeholder="Chọn chi nhánh" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                    {cinemas.map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-totalSeats" className="text-zinc-400 font-bold uppercase text-xs">Tổng số ghế</Label>
                            <Input
                                id="edit-totalSeats"
                                name="totalSeats"
                                type="number"
                                defaultValue={hallToEdit?.totalSeats}
                                className="bg-zinc-900 border-zinc-800"
                                required
                            />
                        </div>
                        <div className="text-xs text-zinc-500 italic">
                            * Lưu ý: Thay đổi số ghế ở đây chỉ cập nhật thông tin phòng. Vui lòng vào "Sơ đồ ghế" để thêm/bớt ghế thực tế.
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isPending} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold w-full">
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu Thay Đổi"}
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
                title="Xóa phòng chiếu"
                description="Bạn có chắc chắn muốn xóa phòng chiếu này? Hành động này không thể hoàn tác nếu đã có lịch chiếu."
            />
        </div>
    )
}
