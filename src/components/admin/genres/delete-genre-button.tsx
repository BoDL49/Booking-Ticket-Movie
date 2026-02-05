"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { deleteGenre } from "@/actions/genres"
import { useRouter } from "next/navigation"
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

interface DeleteGenreButtonProps {
    id: string
    name: string
}

export function DeleteGenreButton({ id, name }: DeleteGenreButtonProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleDelete() {
        setLoading(true)
        const result = await deleteGenre(id)
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(result.success)
            router.refresh()
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-950/30">
                    <Trash className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-400">
                        Hành động này không thể hoàn tác. Thể loại <span className="text-white font-bold">"{name}"</span> sẽ bị xóa vĩnh viễn khỏi hệ thống.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white">Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-green-600 hover:bg-green-700 text-white font-bold" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Xóa
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
