import { BookingClient } from "@/components/booking/booking-client"
import { getShowtimeDetails } from "@/lib/data-service"
import { getActiveConcessions } from "@/actions/booking/concession-actions"
import { notFound } from "next/navigation"

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const data = await getShowtimeDetails(id)
    const concessionsResult = await getActiveConcessions()

    if (!data) {
        notFound()
    }

    const concessions = concessionsResult.data || []

    return (
        <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans">
            <BookingClient showtime={data.showtime} seats={data.seats as any} concessions={concessions} />
        </div>
    )
}
