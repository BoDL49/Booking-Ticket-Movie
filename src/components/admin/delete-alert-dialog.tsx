import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, Trash2 } from "lucide-react"

interface DeleteAlertDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    isDeleting: boolean
    title: string
    description: string
}

export function DeleteAlertDialog({
    open,
    onOpenChange,
    onConfirm,
    isDeleting,
    title,
    description,
}: DeleteAlertDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-black italic tracking-tighter uppercase flex items-center gap-2 text-green-500">
                        <Trash2 className="w-5 h-5" /> {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-400 text-base">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={isDeleting}
                        className="bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800 hover:text-white"
                    >
                        Hủy bỏ
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            onConfirm()
                        }}
                        disabled={isDeleting}
                        className="bg-green-600 text-white hover:bg-green-700 font-bold"
                    >
                        {isDeleting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                        Xác nhận xóa
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
