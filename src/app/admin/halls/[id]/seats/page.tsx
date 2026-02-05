import { db } from "@/lib/db"
import { getHallSeats } from "@/actions/admin/seat-actions"
import { SeatLayoutEditor } from "@/components/admin/halls/seat-layout-editor"
import { Armchair, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Props {
    params: {
        id: string
    }
}

export default async function SeatEditorPage({ params }: Props) {
    const { id } = await params

    const hall = await db.cinemaHall.findUnique({
        where: { id }
    })

    if (!hall) return <div className="text-white">Không tìm thấy phòng chiếu</div>

    const { seats } = await getHallSeats(id)

    return (
        <div className="space-y-8 h-full flex flex-col">
            <div className="flex items-center gap-4">
                <Link href="/admin/halls" className="p-2 bg-zinc-900 rounded-xl hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-zinc-400" />
                </Link>
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-green-500 font-black text-xs uppercase tracking-[0.3em]">
                        <Armchair className="w-4 h-4" /> Seat Layout
                    </div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">
                        Sơ đồ ghế: <span className="text-green-500">{hall.name}</span>
                    </h1>
                </div>
            </div>

            <div className="flex-1">
                <SeatLayoutEditor
                    hallId={hall.id}
                    hallName={hall.name}
                    initialSeats={seats as any || []}
                />
            </div>
        </div>
    )
}
