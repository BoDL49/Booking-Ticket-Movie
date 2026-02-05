"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Monitor, Music, Coffee } from "lucide-react"

const EXPERIENCES = [
    {
        id: "imax",
        title: "IMAX Laser",
        desc: "Màn hình khổng lồ, độ tương phản cực đại, âm thanh sống động đến từng chi tiết.",
        icon: <Monitor className="w-8 h-8" />,
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "bo-gold",
        title: "Bơ Gold Class",
        desc: "Không gian sang trọng với ghế sofa da cao cấp, phục vụ nước uống tại chỗ.",
        icon: <Coffee className="w-8 h-8" />,
        image: "https://images.unsplash.com/photo-1543536448-d209d2d13a1c?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "dolby-atmos",
        title: "Dolby Atmos",
        desc: "Hệ thống âm thanh vòm 360 độ, bao phủ mọi ngóc ngách phòng chiếu.",
        icon: <Music className="w-8 h-8" />,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFMU-lFKLBuKwU4xVZoKWmHWp8f3StTVZ9vA&s?auto=format&fit=crop&q=80&w=800"
    }
]

export function ExperienceSection() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-600/50 to-transparent" />
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 text-green-500 font-black text-xs uppercase tracking-[0.3em] mb-4">
                        <Sparkles className="w-4 h-4" /> Bơ Experience
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white mb-6">
                        Nâng tầm <span className="text-green-600">trải nghiệm</span>
                    </h2>
                    <p className="text-zinc-500 italic">Hơn cả một buổi xem phim, đó là một hành trình cảm xúc trọn vẹn tại BơCinema.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {EXPERIENCES.map((exp) => (
                        <div key={exp.id} className="relative group overflow-hidden rounded-2xl aspect-[4/5]">
                            <img
                                src={exp.image}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                alt={exp.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-8 flex flex-col justify-end">
                                <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl w-fit mb-6 border border-white/10 group-hover:bg-green-600 group-hover:border-green-500 transition-all duration-500">
                                    {exp.icon}
                                </div>
                                <h3 className="text-2xl font-black text-white italic tracking-tight uppercase mb-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">{exp.title}</h3>
                                <p className="text-zinc-300 text-sm italic opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 leading-relaxed">
                                    {exp.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
