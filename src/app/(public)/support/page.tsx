import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-black text-zinc-100 pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-black uppercase text-white mb-8">Chăm sóc khách hàng</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <p className="text-zinc-400 text-lg">
                            Đội ngũ BơCinema luôn sẵn sàng hỗ trợ bạn. Vui lòng liên hệ với chúng tôi qua các kênh dưới đây hoặc gửi tin nhắn trực tiếp.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-green-600/20 p-3 rounded-xl">
                                    <Phone className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Hotline</h3>
                                    <p className="text-zinc-400">1900 8888</p>
                                    <p className="text-zinc-500 text-sm">Hoạt động 8:00 - 22:00 hàng ngày</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-blue-900/20 p-3 rounded-xl">
                                    <Mail className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Email</h3>
                                    <p className="text-zinc-400">support@bocinema.vn</p>
                                    <p className="text-zinc-500 text-sm">Phản hồi trong vòng 24h</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-zinc-800 p-3 rounded-xl">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Văn phòng</h3>
                                    <p className="text-zinc-400">Số 123, Đường Cine, Quận Blockbuster, TP. Hồ Chí Minh</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl">
                        <h2 className="text-xl font-bold text-white mb-6">Gửi tin nhắn hỗ trợ</h2>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-bold text-zinc-400">Họ tên</label>
                                <Input id="name" placeholder="Nhập họ tên của bạn" className="bg-zinc-950 border-zinc-800" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-bold text-zinc-400">Email</label>
                                <Input id="email" type="email" placeholder="Nhập email của bạn" className="bg-zinc-950 border-zinc-800" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-bold text-zinc-400">Nội dung</label>
                                <Textarea id="message" placeholder="Mô tả vấn đề bạn cần hỗ trợ..." className="bg-zinc-950 border-zinc-800 min-h-[120px]" />
                            </div>
                            <Button className="w-full bg-green-600 hover:bg-green-700 font-bold">Gửi Tin Nhắn</Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
