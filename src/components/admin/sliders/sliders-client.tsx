"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/ui/image-upload"
import { getSliders, createSlider, updateSlider, deleteSlider, toggleSliderActive, getMoviesForSlider } from "@/actions/admin/slider-actions"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, ExternalLink, Image as ImageIcon, Film } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SlidersPage({ sliders: initialSliders }: { sliders: any[] }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingSlider, setEditingSlider] = useState<any>(null)
    const [movies, setMovies] = useState<any[]>([])
    const [imageSource, setImageSource] = useState<"custom" | "movie">("custom")
    const router = useRouter()

    useEffect(() => {
        async function loadMovies() {
            const data = await getMoviesForSlider()
            setMovies(data)
        }
        loadMovies()
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        // Handle switch value manually
        const isActive = (e.currentTarget.elements.namedItem('isActive') as HTMLInputElement).checked
        formData.set('isActive', isActive.toString())

        let result
        if (editingSlider) {
            result = await updateSlider(editingSlider.id, formData)
        } else {
            result = await createSlider(formData)
        }

        if (result.success) {
            toast.success(editingSlider ? "Cập nhật thành công" : "Tạo mới thành công")
            setIsDialogOpen(false)
            setEditingSlider(null)
            router.refresh()
        } else {
            toast.error(result.error)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa slider này?")) {
            const result = await deleteSlider(id)
            if (result.success) {
                toast.success("Đã xóa slider")
                router.refresh()
            } else {
                toast.error(result.error)
            }
        }
    }

    const handleToggleActive = async (id: string, currentState: boolean) => {
        const result = await toggleSliderActive(id, currentState)
        if (result.success) {
            toast.success("Đã cập nhật trạng thái")
            router.refresh()
        } else {
            toast.error(result.error)
        }
    }

    const openEdit = (slider: any) => {
        setEditingSlider(slider)
        setImageSource(slider.movieId ? "movie" : "custom")
        setIsDialogOpen(true)
    }

    const openCreate = () => {
        setEditingSlider(null)
        setImageSource("custom")
        setIsDialogOpen(true)
    }

    const getDisplayImage = (slider: any) => {
        if (slider.movieId && slider.movie?.posterUrl) {
            return slider.movie.posterUrl
        }
        return slider.imageUrl
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Quản lý Slider</h1>
                    <p className="text-zinc-400">Quản lý banner hiển thị trên trang chủ.</p>
                </div>
                <Button onClick={openCreate} className="bg-green-600 hover:bg-green-700 text-white font-bold gap-2">
                    <Plus className="w-4 h-4" /> Thêm Slider
                </Button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-950">
                        <TableRow className="hover:bg-zinc-950 border-zinc-800">
                            <TableHead className="w-[100px] text-zinc-400">Hình ảnh</TableHead>
                            <TableHead className="text-zinc-400">Tiêu đề</TableHead>
                            <TableHead className="text-zinc-400">Nguồn</TableHead>
                            <TableHead className="text-zinc-400">Liên kết</TableHead>
                            <TableHead className="text-zinc-400">Trạng thái</TableHead>
                            <TableHead className="text-right text-zinc-400">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialSliders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-zinc-500">
                                    Chưa có slider nào. Hãy thêm mới!
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialSliders.map((slider) => (
                                <TableRow key={slider.id} className="hover:bg-zinc-900/50 border-zinc-800">
                                    <TableCell>
                                        <div className="w-24 h-14 bg-zinc-800 rounded-md overflow-hidden relative border border-zinc-700">
                                            {getDisplayImage(slider) ? (
                                                <img src={getDisplayImage(slider)} alt={slider.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-zinc-600"><ImageIcon className="w-6 h-6" /></div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-zinc-200">{slider.title}</TableCell>
                                    <TableCell>
                                        {slider.movieId ? (
                                            <div className="flex items-center gap-2 text-green-500 text-sm">
                                                <Film className="w-4 h-4" />
                                                <span>{slider.movie?.title || "Phim"}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                                <ImageIcon className="w-4 h-4" />
                                                <span>Tùy chỉnh</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-zinc-400 text-sm max-w-[200px] truncate">
                                        {slider.linkUrl ? (
                                            <a href={slider.linkUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-green-500 hover:underline">
                                                {slider.linkUrl} <ExternalLink className="w-3 h-3" />
                                            </a>
                                        ) : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={slider.isActive}
                                            onCheckedChange={() => handleToggleActive(slider.id, slider.isActive)}
                                            className="data-[state=checked]:bg-green-600"
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800" onClick={() => openEdit(slider)}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(slider.id)}>
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingSlider ? "Chỉnh sửa Slider" : "Thêm Slider Mới"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Tiêu đề</Label>
                            <Input name="title" required defaultValue={editingSlider?.title} placeholder="Nhập tiêu đề banner..." className="bg-zinc-950 border-zinc-800 focus-visible:ring-green-600" />
                        </div>

                        <Tabs value={imageSource} onValueChange={(v) => setImageSource(v as "custom" | "movie")} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-zinc-950">
                                <TabsTrigger value="custom">Hình ảnh tùy chỉnh</TabsTrigger>
                                <TabsTrigger value="movie">Poster phim</TabsTrigger>
                            </TabsList>
                            <TabsContent value="custom" className="space-y-2 mt-4">
                                <Label>Hình ảnh (16:9)</Label>
                                <Input type="hidden" name="movieId" value="" />
                                <ImageUpload
                                    name="imageUrl"
                                    defaultValue={!editingSlider?.movieId ? editingSlider?.imageUrl : ""}
                                    endpoint="sliderImage"
                                />
                            </TabsContent>
                            <TabsContent value="movie" className="space-y-2 mt-4">
                                <Label>Chọn Phim</Label>
                                <Input type="hidden" name="imageUrl" value="" />
                                <Select name="movieId" defaultValue={editingSlider?.movieId || ""}>
                                    <SelectTrigger className="bg-zinc-950 border-zinc-800">
                                        <SelectValue placeholder="Chọn phim để lấy poster..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                        {movies.map((movie) => (
                                            <SelectItem key={movie.id} value={movie.id}>
                                                {movie.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TabsContent>
                        </Tabs>

                        <div className="space-y-2">
                            <Label>Đường dẫn liên kết (Tùy chọn)</Label>
                            <Input name="linkUrl" defaultValue={editingSlider?.linkUrl} placeholder="/movies/matrix..." className="bg-zinc-950 border-zinc-800 focus-visible:ring-green-600" />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                            <div className="space-y-0.5">
                                <Label>Hiển thị</Label>
                                <p className="text-xs text-zinc-500">Bật để hiển thị slider này trên trang chủ</p>
                            </div>
                            <Switch name="isActive" defaultChecked={editingSlider?.isActive ?? true} className="data-[state=checked]:bg-green-600" />
                        </div>

                        <div className="flex justify-end pt-4 gap-3">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="hover:bg-zinc-800 text-zinc-400">Hủy</Button>
                            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold">Lưu Slider</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
