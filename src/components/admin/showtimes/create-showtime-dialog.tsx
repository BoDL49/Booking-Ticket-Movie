"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { createShowtime } from "@/actions/admin/showtime-actions"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    movieId: z.string().min(1, "Vui lòng chọn phim"),
    hallId: z.string().min(1, "Vui lòng chọn phòng chiếu"),
    startTime: z.string().min(1, "Vui lòng chọn giờ chiếu"),
    basePrice: z.string().min(1, "Vui lòng nhập giá vé"),
    format: z.string().default("TWO_D"),
    language: z.string().default("VIETSUB"),
})

interface CreateShowtimeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    movies: { id: string, title: string, duration: number }[]
    halls: { id: string, name: string }[]
}

export function CreateShowtimeDialog({ open, onOpenChange, movies, halls }: CreateShowtimeDialogProps) {
    const [isPending, startTransition] = useTransition()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            movieId: "",
            hallId: "",
            startTime: "",
            basePrice: "75000",
            format: "TWO_D",
            language: "VIETSUB",
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            const result = await createShowtime(values)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(result.success)
                form.reset()
                onOpenChange(false)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase">Thêm Suất Chiếu Mới</DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Tạo lịch chiếu cho phim. Hãy chắc chắn không trùng lịch.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="movieId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-400 font-bold uppercase text-xs">Phim</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                                <SelectValue placeholder="Chọn phim..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white max-h-[300px]">
                                            {movies.map((movie) => (
                                                <SelectItem key={movie.id} value={movie.id} className="focus:bg-zinc-800 focus:text-white cursor-pointer">
                                                    {movie.title} ({movie.duration}p)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="hallId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-400 font-bold uppercase text-xs">Phòng Chiếu</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                                    <SelectValue placeholder="Chọn phòng..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                                {halls.map((hall) => (
                                                    <SelectItem key={hall.id} value={hall.id} className="focus:bg-zinc-800 focus:text-white cursor-pointer">
                                                        {hall.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="basePrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-400 font-bold uppercase text-xs">Giá Vé (VNĐ)</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" className="bg-zinc-900 border-zinc-800" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-400 font-bold uppercase text-xs">Thời Gian Chiếu</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="datetime-local" className="bg-zinc-900 border-zinc-800 block w-full" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="format"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-400 font-bold uppercase text-xs">Định Dạng</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                                    <SelectValue placeholder="Format" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                                <SelectItem value="TWO_D">2D</SelectItem>
                                                <SelectItem value="THREE_D">3D</SelectItem>
                                                <SelectItem value="IMAX">IMAX</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="language"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-400 font-bold uppercase text-xs">Ngôn Ngữ</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                                    <SelectValue placeholder="Language" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                                <SelectItem value="VIETSUB">Phụ Đề (Vietsub)</SelectItem>
                                                <SelectItem value="DUBBED">Lồng Tiếng</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-zinc-400 hover:text-white">
                                Hủy bỏ
                            </Button>
                            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold" disabled={isPending}>
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Xác Nhận Tạo
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
