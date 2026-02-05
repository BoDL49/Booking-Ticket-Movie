import { getNowShowingMovies, getComingSoonMovies } from "@/lib/data-service"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, TrendingUp, CalendarDays } from "lucide-react"

import { HeroSlider } from "@/components/movies/hero-slider"
import { PromotionSection } from "@/components/home/promotion-section"
import { ExperienceSection } from "@/components/home/experience-section"
import { ComingSoonCarousel } from "@/components/home/coming-soon-carousel"
import { PaginatedMovieGrid } from "@/components/movies/paginated-movie-grid"

import { db } from "@/lib/db"
import { HeroCarousel } from "@/components/home/hero-carousel"

export const revalidate = 60 // Revalidate every minute

export default async function Home() {
  const [nowShowing, comingSoon, activeSliders] = await Promise.all([
    getNowShowingMovies(),
    getComingSoonMovies(),
    db.slider.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
  ])

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-green-600 selection:text-white">
      {/* Hero Section */}
      {activeSliders.length > 0 ? (
        <HeroCarousel sliders={activeSliders} />
      ) : (
        <HeroSlider movies={nowShowing.slice(0, 5)} />
      )}

      {/* Featured Movies Section */}
      <section className="container mx-auto px-4 pb-20 pt-12 relative z-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-green-500 font-black text-xs uppercase tracking-[0.3em]">
              <TrendingUp className="w-4 h-4" /> Hot Now
            </div>
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white">
              Phim <span className="text-green-600">Đang Chiếu</span>
            </h2>
          </div>

          <Button variant="link" asChild className="text-green-600 hover:text-green-500 font-black italic uppercase tracking-wider gap-2 p-0 h-auto">
            <Link href="/movies">
              Xem tất cả phim <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <PaginatedMovieGrid movies={nowShowing} />
      </section>

      {/* Coming Soon Section */}
      <section className="container mx-auto px-4 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-600/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-zinc-500 font-black text-xs uppercase tracking-[0.3em]">
              <CalendarDays className="w-4 h-4" /> Next Up
            </div>
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white">
              Phim <span className="text-zinc-500 group-hover:text-white transition-colors">Sắp Chiếu</span>
            </h2>
          </div>

          <Button variant="link" asChild className="text-zinc-400 hover:text-white font-black italic uppercase tracking-wider gap-2 p-0 h-auto">
            <Link href="/movies?status=COMING_SOON">
              Lịch khởi chiếu sớm <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="relative z-10">
          <ComingSoonCarousel movies={comingSoon} />
        </div>
      </section>

      {/* Experience Highlights */}
      <ExperienceSection />

      {/* Promotions */}
      <PromotionSection />

      {/* App CTA (Styled Section) */}
      <section className="py-24 container mx-auto px-4">
        <div className="bg-gradient-to-br from-green-600 to-green-900 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-white/20 transition-all duration-700" />
          <div className="relative z-10 space-y-8 flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white leading-tight">
              Mang cả rạp phim <br /> <span className="text-green-200">trong túi bạn</span>
            </h2>
            <p className="text-green-100 max-w-md italic text-lg opacity-80">
              Tải ngay ứng dụng BơCinema để đặt vé nhanh hơn, tích nhiều điểm hơn và không bỏ lỡ các suất chiếu sớm đặc biệt.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" className="h-10 cursor-pointer hover:scale-105 transition-transform" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" className="h-10 cursor-pointer hover:scale-105 transition-transform" />
            </div>
          </div>
          <div className="relative z-10 w-full md:w-1/3 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 blur-[80px] opacity-30 animate-pulse" />
              <img
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=400"
                className="w-48 md:w-64 rounded-[2rem] shadow-2xl rotate-6 group-hover:rotate-0 transition-transform duration-700 border-4 border-white/20"
                alt="Mobile App"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
