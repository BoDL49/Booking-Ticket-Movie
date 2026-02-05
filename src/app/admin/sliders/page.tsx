
import { db } from "@/lib/db"
import SlidersPage from "@/components/admin/sliders/sliders-client"

export default async function AdminSlidersPage() {
    const sliders = await db.slider.findMany({
        orderBy: { order: 'asc' }
    })

    return <SlidersPage sliders={sliders} />
}
