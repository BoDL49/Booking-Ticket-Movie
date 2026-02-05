"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, Pencil, Trash2 } from "lucide-react"
import { CinemaDialog } from "./cinema-dialog"
import { useState } from "react"
import { deleteCinema } from "@/actions/admin/cinema-actions"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Cinema {
    id: string
    name: string
    address: string | null
    imageUrl?: string | null
    _count: {
        halls: number
    }
}

export function CinemasTable({ cinemas }: { cinemas: Cinema[] }) {
    const handleDelete = async (id: string) => {
        const result = await deleteCinema(id)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(result.success)
        }
    }

    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden shadow-xl">
            <Table>
                <TableHeader className="bg-zinc-900">
                    <TableRow className="border-zinc-800 hover:bg-zinc-900">
                        <TableHead className="w-[80px]">Logo</TableHead>
                        <TableHead className="text-zinc-400 font-bold">Tên Chi Nhánh</TableHead>
                        <TableHead className="text-zinc-400 font-bold">Địa Chỉ</TableHead>
                        <TableHead className="text-zinc-400 font-bold text-center">Số Phòng</TableHead>
                        <TableHead className="text-right text-zinc-400 font-bold">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cinemas.map((cinema) => (
                        <TableRow key={cinema.id} className="border-zinc-800 hover:bg-zinc-800/50">
                            <TableCell>
                                <div className="h-12 w-12 rounded-lg bg-zinc-800 border border-white/5 overflow-hidden flex items-center justify-center">
                                    {cinema.imageUrl ? (
                                        <img src={cinema.imageUrl} alt={cinema.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <Building2 className="h-6 w-6 text-zinc-600" />
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="font-bold text-white max-w-[200px] truncate">{cinema.name}</TableCell>
                            <TableCell className="text-zinc-400 max-w-[300px] truncate">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-3 w-3 shrink-0" />
                                    {cinema.address}
                                </div>
                            </TableCell>
                            <TableCell className="text-center font-bold text-green-500 bg-green-500/10 rounded px-2">
                                {cinema._count.halls}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <CinemaDialog
                                        mode="edit"
                                        cinema={cinema}
                                        trigger={
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        }
                                    />

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-950/30">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Xóa chi nhánh?</AlertDialogTitle>
                                                <AlertDialogDescription className="text-zinc-400">
                                                    Bạn có chắc chắn muốn xóa <span className="text-white font-bold">"{cinema.name}"</span>?
                                                    Hành động này không thể hoàn tác.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="bg-transparent border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white">Hủy</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(cinema.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold">
                                                    Xóa
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {cinemas.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-zinc-500 italic">
                                Chưa có chi nhánh nào được thêm.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
