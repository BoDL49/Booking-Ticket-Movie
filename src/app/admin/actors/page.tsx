import { db } from "@/lib/db"
import { ActorsTable } from "@/components/admin/actors/actors-table"
import { User, Users, Image as ImageIcon } from "lucide-react"

export default async function ActorsPage() {
    const actors = await db.person.findMany({
        orderBy: {
            name: "asc"
        },
        include: {
            actedIn: true,
            directedMovies: true
        }
    })

    const totalActors = actors.length
    const withBio = actors.filter((a: any) => a.bio).length
    const withAvatar = actors.filter((a: any) => a.avatarUrl).length

    return (
        <div className="space-y-10 pb-10">
            {/* Header section with Stats */}
            <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-white/5 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-red-600/10 blur-[100px]" />
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">
                            Quản lý <span className="text-red-600">Diễn Viên</span>
                        </h1>
                        <p className="text-zinc-500 font-medium italic underline underline-offset-4 decoration-red-600/50">
                            Danh dách nghệ sĩ, đạo diễn và nhân vật trong hệ thống.
                        </p>
                    </div>

                    <ActorsTable actors={actors} mode="add-trigger" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                    <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Tổng cộng</p>
                        <p className="text-2xl font-black italic text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-red-600" />
                            {totalActors}
                        </p>
                    </div>
                    <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Có tiểu sử</p>
                        <p className="text-2xl font-black italic text-white flex items-center gap-2">
                            <User className="w-5 h-5 text-green-500" />
                            {withBio}
                        </p>
                    </div>
                    <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Có ảnh đại diện</p>
                        <p className="text-2xl font-black italic text-white flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-blue-500" />
                            {withAvatar}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actors Table */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden shadow-xl backdrop-blur-sm">
                <ActorsTable actors={actors} />
            </div>
        </div>
    )
}
