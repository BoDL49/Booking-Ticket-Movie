import { getHalls } from "@/actions/admin/hall-actions"
import { getCinemas } from "@/actions/admin/cinema-actions"
import { HallsTable } from "@/components/admin/halls/halls-table"
import { MapPin, Armchair } from "lucide-react"

export default async function AdminHallsPage() {
    const { halls } = await getHalls()
    const { cinemas } = await getCinemas()

    if (!halls || !cinemas) {
        return <div className="text-white">Không tải được dữ liệu.</div>
    }

    const totalSeats = halls.reduce((sum: number, h: any) => sum + h.totalSeats, 0)

    return (
        <div className="space-y-8 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-500 font-black text-xs uppercase tracking-[0.3em]">
                        <MapPin className="w-4 h-4" /> Infrastructure
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">
                        Quản lý <span className="text-green-600">Phòng Chiếu</span>
                    </h1>
                    <p className="text-zinc-500 max-w-md italic">
                        Quản lý sơ đồ phòng, số lượng ghế và cơ sở vật chất.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-xl">
                            <MapPin className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Tổng số phòng</p>
                            <p className="text-2xl font-black italic tracking-tighter text-white">{halls.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl">
                            <Armchair className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Tổng sức chứa</p>
                            <p className="text-2xl font-black italic tracking-tighter text-purple-500">{totalSeats} <span className="text-sm text-zinc-500">ghế</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <HallsTable halls={halls as any} cinemas={cinemas as any} />
            </div>
        </div>
    )
}
