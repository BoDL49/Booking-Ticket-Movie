"use client"

import { useState, useTransition } from "react"
import {
    Edit2,
    Trash2,
    Plus,
    MoreHorizontal,
    Star,
    Clock,
    Calendar,
    Film,
    Loader2,
    ExternalLink,
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
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ui/image-upload"
import { toast } from "sonner"
import { createMovie, updateMovie, deleteMovie } from "@/actions/admin/movie-actions"
import Link from "next/link"
import { DeleteAlertDialog } from "../delete-alert-dialog"

interface Person {
    id: string
    name: string
}

interface Genre {
    id: string
    name: string
}

interface MovieCast {
    personId: string
    person: Person
    characterName: string
}

interface Movie {
    id: string
    title: string
    description: string
    duration: number
    posterUrl: string | null
    trailerUrl: string | null
    releaseDate: Date
    rating: number | null
    ageRating: string
    status: string
    country: string | null
    directorId: string | null
    director?: Person | null
    cast?: MovieCast[]
    genres?: { genreId: string }[]
}

export function MoviesTable({
    movies,
    persons = [],
    genres = [],
    mode = "table"
}: {
    movies: Movie[],
    persons?: Person[],
    genres?: Genre[],
    mode?: "table" | "add-trigger"
}) {
    const [isPending, startTransition] = useTransition()
    const [isOpen, setIsOpen] = useState(false)
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")

    const filteredMovies = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "ALL" || movie.status === statusFilter
        return matchesSearch && matchesStatus
    })

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        duration: "",
        posterUrl: "",
        trailerUrl: "",
        releaseDate: "",
        rating: "5.0",
        ageRating: "P",
        status: "COMING_SOON",
        country: "Việt Nam",
        directorId: "none",
        cast: [] as { personId: string, characterName: string }[],
        genreIds: [] as string[]
    })

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            duration: "",
            posterUrl: "",
            trailerUrl: "",
            releaseDate: "",
            rating: "5.0",
            ageRating: "P",
            status: "COMING_SOON",
            country: "Việt Nam",
            directorId: "none",
            cast: [],
            genreIds: []
        })
        setEditingMovie(null)
    }

    const handleOpenAdd = () => {
        resetForm()
        setIsOpen(true)
    }

    const handleOpenEdit = (movie: Movie) => {
        setEditingMovie(movie)
        setFormData({
            title: movie.title,
            description: movie.description,
            duration: movie.duration.toString(),
            posterUrl: movie.posterUrl || "",
            trailerUrl: movie.trailerUrl || "",
            releaseDate: new Date(movie.releaseDate).toISOString().split('T')[0],
            rating: (movie.rating || 5.0).toString(),
            ageRating: movie.ageRating,
            status: movie.status || "COMING_SOON",
            country: movie.country || "Việt Nam",
            directorId: movie.directorId || "none",
            cast: movie.cast?.map(c => ({ personId: c.personId, characterName: c.characterName })) || [],
            genreIds: movie.genres?.map(g => g.genreId) || []
        })
        setIsOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        startTransition(async () => {
            const movieData = {
                title: formData.title,
                description: formData.description,
                duration: Number(formData.duration),
                posterUrl: formData.posterUrl,
                trailerUrl: formData.trailerUrl,
                releaseDate: formData.releaseDate,
                rating: Number(formData.rating),
                ageRating: formData.ageRating,
                status: formData.status,
                country: formData.country,
                directorId: formData.directorId === "none" ? null : formData.directorId,
                cast: formData.cast,
                genreIds: formData.genreIds
            }

            const result = editingMovie
                ? await updateMovie(editingMovie.id, movieData)
                : await createMovie(movieData)

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
    const [movieToDelete, setMovieToDelete] = useState<string | null>(null)

    const handleDeleteClick = (id: string) => {
        setMovieToDelete(id)
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        if (!movieToDelete) return

        startTransition(async () => {
            const result = await deleteMovie(movieToDelete)
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
                    <Plus className="w-5 h-5" /> THÊM PHIM MỚI
                </Button>
            ) : (
                <div className="space-y-4">
                    {/* Filters Bar */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6 bg-zinc-950/30 p-4 rounded-2xl border border-white/5">
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-green-500 transition-colors" />
                            <Input
                                placeholder="Tìm kiếm phim theo tiêu đề..."
                                className="pl-10 bg-zinc-900 border-zinc-800 focus:ring-green-500/20 focus:border-green-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest mr-2">
                                <Filter className="w-3 h-3" /> Lọc:
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-[200px] bg-zinc-900 border-zinc-800">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                    <SelectItem value="ALL">Tất cả phim</SelectItem>
                                    <SelectItem value="NOW_SHOWING">Đang chiếu</SelectItem>
                                    <SelectItem value="COMING_SOON">Sắp chiếu</SelectItem>
                                    <SelectItem value="ENDED">Đã kết thúc</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Table>
                        <TableHeader className="bg-zinc-950/50">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="w-[80px]">Poster</TableHead>
                                <TableHead className="font-bold text-zinc-400">Tên phim</TableHead>
                                <TableHead className="font-bold text-zinc-400">Thời lượng</TableHead>
                                <TableHead className="font-bold text-zinc-400">Phân loại</TableHead>
                                <TableHead className="font-bold text-zinc-400">Trạng thái</TableHead>
                                <TableHead className="font-bold text-zinc-400">Đánh giá</TableHead>
                                <TableHead className="w-[100px] text-right font-bold text-zinc-400">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMovies.map((movie) => (
                                <TableRow key={movie.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                    <TableCell>
                                        <div className="w-12 h-16 rounded-lg bg-zinc-800 border border-white/5 overflow-hidden flex items-center justify-center">
                                            {movie.posterUrl ? (
                                                <img src={movie.posterUrl} className="w-full h-full object-cover" alt={movie.title} />
                                            ) : (
                                                <Film className="w-5 h-5 text-zinc-600" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <p className="font-black text-white italic lowercase tracking-tight line-clamp-1">{movie.title}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <Calendar className="w-3 h-3 text-zinc-500" />
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                                                    {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3 text-green-500" />
                                            <span className="text-zinc-300 font-bold text-sm italic">{movie.duration} <span className="text-[10px] text-zinc-600 not-italic uppercase">phút</span></span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${movie.ageRating === 'P' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                            movie.ageRating === 'K' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                movie.ageRating === 'C13' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                    'bg-green-500/10 text-green-500 border-green-500/20'
                                            }`}>
                                            {movie.ageRating}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${movie.status === 'NOW_SHOWING' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                            movie.status === 'COMING_SOON' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                movie.status === 'ENDED' ? 'Kết thúc' : 'Chưa kích hoạt'
                                            }`}>
                                            {movie.status === 'NOW_SHOWING' ? 'Đang chiếu' :
                                                movie.status === 'COMING_SOON' ? 'Sắp chiếu' : 'Kết thúc'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            <span className="text-white font-black italic text-sm">{movie.rating}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800">
                                                <Link href={`/movie/${movie.id}`} target="_blank">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-800 text-zinc-400">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800 text-zinc-300">
                                                    <DropdownMenuItem onClick={() => handleOpenEdit(movie)} className="focus:bg-zinc-900 focus:text-white cursor-pointer">
                                                        <Edit2 className="w-4 h-4 mr-2" /> Chỉnh sửa
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteClick(movie.id)} className="text-green-500 focus:bg-green-500/10 focus:text-green-500 cursor-pointer">
                                                        <Trash2 className="w-4 h-4 mr-2" /> Xóa phim
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredMovies.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-zinc-500 font-bold italic">
                                        Chưa có phim nào trong danh sách.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Movie Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase">
                            {editingMovie ? "Cập nhật" : "Thêm"} <span className="text-green-600">Phim Mới</span>
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 italic">
                            Điền đầy đủ thông tin chi tiết về bộ phim để hiển thị cho khách hàng.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Tiêu đề phim</Label>
                                <Input
                                    id="title"
                                    className="bg-zinc-900 border-zinc-800 focus:ring-green-500"
                                    placeholder="Vd: Avatar: The Way of Water"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Duration */}
                            <div className="space-y-2">
                                <Label htmlFor="duration" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Thời lượng (Phút)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    className="bg-zinc-900 border-zinc-800 focus:ring-green-500"
                                    placeholder="120"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Release Date */}
                            <div className="space-y-2">
                                <Label htmlFor="releaseDate" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Ngày phát hành</Label>
                                <Input
                                    id="releaseDate"
                                    type="date"
                                    className="bg-zinc-900 border-zinc-800 focus:ring-green-500"
                                    value={formData.releaseDate}
                                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Poster Image Upload */}
                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Ảnh Poster Phim</Label>
                                <ImageUpload
                                    value={formData.posterUrl}
                                    onChange={(url) => setFormData({ ...formData, posterUrl: url })}
                                />
                            </div>

                            {/* Trailer URL */}
                            <div className="space-y-2">
                                <Label htmlFor="trailerUrl" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Link Trailer (Youtube)</Label>
                                <Input
                                    id="trailerUrl"
                                    className="bg-zinc-900 border-zinc-800 focus:ring-green-500"
                                    placeholder="https://www.youtube.com/..."
                                    value={formData.trailerUrl}
                                    onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                                />
                            </div>

                            {/* Rating */}
                            <div className="space-y-2">
                                <Label htmlFor="rating" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Đánh giá (0-10)</Label>
                                <Input
                                    id="rating"
                                    type="number"
                                    step="0.1"
                                    max="10"
                                    min="0"
                                    className="bg-zinc-900 border-zinc-800 focus:ring-green-500"
                                    value={formData.rating}
                                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                />
                            </div>

                            {/* Age Rating */}
                            <div className="space-y-2">
                                <Label htmlFor="ageRating" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Phân loại lứa tuổi</Label>
                                <Select
                                    value={formData.ageRating}
                                    onValueChange={(v) => setFormData({ ...formData, ageRating: v })}
                                >
                                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                        <SelectValue placeholder="Chọn độ tuổi" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                        <SelectItem value="P">P - Mọi lứa tuổi</SelectItem>
                                        <SelectItem value="K">K - Dưới 13 tuổi (có giám hộ)</SelectItem>
                                        <SelectItem value="C13">C13 - Trên 13 tuổi</SelectItem>
                                        <SelectItem value="C16">C16 - Trên 16 tuổi</SelectItem>
                                        <SelectItem value="C18">C18 - Trên 18 tuổi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Country */}
                            <div className="space-y-2">
                                <Label htmlFor="country" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Quốc gia</Label>
                                <Input
                                    id="country"
                                    className="bg-zinc-900 border-zinc-800 focus:ring-green-500"
                                    placeholder="USA, Việt Nam, Hàn Quốc..."
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                />
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Trạng thái phim</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(v) => setFormData({ ...formData, status: v })}
                                >
                                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                        <SelectItem value="NOW_SHOWING">Đang chiếu (Now Showing)</SelectItem>
                                        <SelectItem value="COMING_SOON">Sắp chiếu (Coming Soon)</SelectItem>
                                        <SelectItem value="ENDED">Đã kết thúc (Ended)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Genre Selection */}
                            <div className="space-y-3 col-span-1 md:col-span-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Thể loại phim</Label>
                                <div className="flex flex-wrap gap-2">
                                    {genres?.map((genre) => {
                                        const isSelected = formData.genreIds.includes(genre.id)
                                        return (
                                            <div
                                                key={genre.id}
                                                onClick={() => {
                                                    const newGenreIds = isSelected
                                                        ? formData.genreIds.filter(id => id !== genre.id)
                                                        : [...formData.genreIds, genre.id]
                                                    setFormData({ ...formData, genreIds: newGenreIds })
                                                }}
                                                className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${isSelected
                                                    ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-900/20"
                                                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                                                    }`}
                                            >
                                                {genre.name}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <Label htmlFor="director" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Đạo diễn</Label>
                                <Select
                                    value={formData.directorId}
                                    onValueChange={(v) => setFormData({ ...formData, directorId: v })}
                                >
                                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                        <SelectValue placeholder="Chọn đạo diễn" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                        <SelectItem value="none">Chưa xác định</SelectItem>
                                        {persons.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Cast Management */}
                            <div className="space-y-4 col-span-1 md:col-span-2 p-4 rounded-2xl bg-zinc-900/30 border border-white/5">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-black italic">Danh sách diễn viên</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-8 rounded-full bg-green-600/10 text-green-500 border-green-500/20 hover:bg-green-600 hover:text-white transition-all font-bold italic"
                                        onClick={() => setFormData({ ...formData, cast: [...formData.cast, { personId: "", characterName: "" }] })}
                                    >
                                        <Plus className="w-3 h-3 mr-1" /> THÊM DIỄN VIÊN
                                    </Button>
                                </div>

                                {formData.cast.length === 0 ? (
                                    <p className="text-[10px] text-zinc-600 italic text-center py-4">Chưa có diễn viên nào được thêm.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {formData.cast.map((c, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                                                <div className="flex-1 space-y-1.5 min-w-[200px]">
                                                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Diễn viên</Label>
                                                    <Select
                                                        value={c.personId}
                                                        onValueChange={(v) => {
                                                            const newCast = [...formData.cast]
                                                            newCast[index].personId = v
                                                            setFormData({ ...formData, cast: newCast })
                                                        }}
                                                    >
                                                        <SelectTrigger className="bg-black/40 border-zinc-800 h-9">
                                                            <SelectValue placeholder="Chọn diễn viên" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                                            {persons.map((p) => (
                                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex-1 space-y-1.5 min-w-[150px]">
                                                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Vai diễn (Tên nhân vật)</Label>
                                                    <Input
                                                        className="bg-black/40 border-zinc-800 h-9"
                                                        placeholder="Vd: Iron Man"
                                                        value={c.characterName}
                                                        onChange={(e) => {
                                                            const newCast = [...formData.cast]
                                                            newCast[index].characterName = e.target.value
                                                            setFormData({ ...formData, cast: newCast })
                                                        }}
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 text-zinc-600 hover:text-green-500 hover:bg-green-500/10"
                                                    onClick={() => {
                                                        const newCast = formData.cast.filter((_, i) => i !== index)
                                                        setFormData({ ...formData, cast: newCast })
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Mô tả nội dung</Label>
                            <Textarea
                                id="description"
                                rows={4}
                                className="bg-zinc-900 border-zinc-800 focus:ring-green-500 italic"
                                placeholder="Nội dung tóm tắt của bộ phim..."
                                value={formData.description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
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
                                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingMovie ? "CẬP NHẬT PHIM" : "XÁC NHẬN THÊM")}
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
                title="Xác nhận xóa phim"
                description="Bạn có chắc chắn muốn xóa phim này không? Hành động này sẽ xóa vĩnh viễn phim, bao gồm cả Lịch Sử Chiếu, Diễn Viên tham gia và các dữ liệu liên quan. Phim ĐANG CÓ VÉ ĐẶT sẽ không thể xóa."
            />
        </>
    )
}
