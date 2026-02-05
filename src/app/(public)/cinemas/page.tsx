import { getAllCinemas } from "@/lib/data-service"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Film, Armchair } from "lucide-react"

export default async function CinemasPage() {
    const cinemas = await getAllCinemas()

    return (
        <div className="min-h-screen bg-black text-zinc-100 pt-24 pb-20">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white mb-4">
                        Hệ Thống <span className="text-green-500">Rạp Chiếu</span>
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Trải nghiệm điện ảnh đỉnh cao tại hệ thống rạp BơCinema trên toàn quốc.
                        Không gian sang trọng, âm thanh sống động, màn hình sắc nét.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cinemas.map((cinema: any) => (
                        <div key={cinema.id} className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-green-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-900/20">
                            <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                                {cinema.imageUrl ? (
                                    <div className="absolute inset-0">
                                        <img
                                            src={cinema.imageUrl}
                                            alt={cinema.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-90" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                            <Film className="w-16 h-16 text-zinc-700 group-hover:text-green-600 transition-colors duration-300" />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                                    </>
                                )}

                                <div className="absolute bottom-4 left-4 right-4">
                                    <h2 className="text-xl font-bold text-white mb-1 group-hover:text-green-500 transition-colors">{cinema.name}</h2>
                                    <div className="flex items-center text-zinc-400 text-sm gap-2">
                                        <MapPin className="w-3 h-3 text-green-600" />
                                        <span className="truncate">{cinema.address || "Đang cập nhật địa chỉ"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between text-sm text-zinc-400 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
                                    <div className="flex items-center gap-2">
                                        <Armchair className="w-4 h-4 text-zinc-500" />
                                        <span>Số phòng chiếu:</span>
                                    </div>
                                    <span className="font-bold text-white">{cinema._count?.halls || 0} phòng</span>
                                </div>

                                <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-green-900/20 group-hover:shadow-green-900/40 transition-all">
                                    <Link href={`/cinemas/${cinema.id}`}>
                                        Xem Suất Chiếu
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {cinemas.length === 0 && (
                    <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-zinc-800 border-dashed">
                        <MapPin className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-zinc-400">Hệ thống đang cập nhật danh sách rạp</h3>
                        <p className="text-zinc-600 mt-2">Vui lòng quay lại sau</p>
                    </div>
                )}
            </div>
        </div>
    )
}
