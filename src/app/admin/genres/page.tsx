
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus, Pencil, Trash } from "lucide-react"
import { GenreDialog } from "../../../components/admin/genres/genre-dialog"
import { DeleteGenreButton } from "../../../components/admin/genres/delete-genre-button"

export default async function AdminGenresPage() {
    const genres = await db.genre.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: {
                select: { movies: true },
            },
        },
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Quản lý Thể loại</h1>
                    <p className="text-zinc-400">Danh sách các thể loại phim trong hệ thống</p>
                </div>
                <GenreDialog mode="create" />
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-900">
                        <TableRow className="border-zinc-800 hover:bg-zinc-900">
                            <TableHead className="text-zinc-400 font-bold">Tên thể loại</TableHead>
                            <TableHead className="text-zinc-400 font-bold">Slug</TableHead>
                            <TableHead className="text-zinc-400 font-bold">Số lượng phim</TableHead>
                            <TableHead className="text-right text-zinc-400 font-bold">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {genres.map((genre: any) => (
                            <TableRow key={genre.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                <TableCell className="font-medium text-white">{genre.name}</TableCell>
                                <TableCell className="text-zinc-400">{genre.slug}</TableCell>
                                <TableCell className="text-zinc-400">{genre._count.movies} phim</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <GenreDialog mode="edit" genre={genre} />
                                        <DeleteGenreButton id={genre.id} name={genre.name} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {genres.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-zinc-500">
                                    Chưa có thể loại nào.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
