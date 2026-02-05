import { getCinemas } from "@/actions/admin/cinema-actions"
import { CinemasTable } from "@/components/admin/cinemas/cinemas-table"
import { CinemaDialog } from "@/components/admin/cinemas/cinema-dialog"
import { Building2 } from "lucide-react"

export default async function AdminCinemasPage() {
    const { cinemas } = await getCinemas()

    if (!cinemas) {
        return <div className="text-white">Không tải được danh sách chi nhánh.</div>
    }

    return (
        <div className="space-y-8 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-500 font-black text-xs uppercase tracking-[0.3em]">
                        <Building2 className="w-4 h-4" /> Network
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">
                        Quản lý <span className="text-green-500">Chi Nhánh</span>
                    </h1>
                    <p className="text-zinc-500 max-w-md italic">
                        Quản lý danh sách các rạp chiếu và địa điểm.
                    </p>
                </div>
                <CinemaDialog mode="create" />
            </div>

            <div className="flex-1">
                <CinemasTable cinemas={cinemas as any} />
            </div>
        </div>
    )
}
