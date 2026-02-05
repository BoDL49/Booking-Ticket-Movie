"use client"

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PlayCircle } from "lucide-react"
import { useState } from "react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface TrailerDialogProps {
    trailerUrl: string | null
    title: string
    trigger?: React.ReactNode
}

export function TrailerDialog({ trailerUrl, title, trigger }: TrailerDialogProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Helper to get YouTube Embed URL
    const getEmbedUrl = (url: string) => {
        if (!url) return ""
        // Handle standard watch?v= format
        const vId = url.split('v=')[1]?.split('&')[0]
        if (vId) return `https://www.youtube.com/embed/${vId}?autoplay=1`

        // Handle youtu.be/ shorthand
        if (url.includes('youtu.be/')) {
            const id = url.split('youtu.be/')[1]
            return `https://www.youtube.com/embed/${id}?autoplay=1`
        }

        return url // Fallback if already embed or unknown
    }

    if (!trailerUrl) return null

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold rounded-full h-12 gap-2 transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                        <PlayCircle className="w-5 h-5" />
                        Xem Trailer
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="bg-black/90 border-zinc-800 p-0 sm:max-w-[800px] w-full aspect-video overflow-hidden">
                <VisuallyHidden>
                    <DialogTitle>Trailer: {title}</DialogTitle>
                </VisuallyHidden>
                {isOpen && (
                    <iframe
                        src={getEmbedUrl(trailerUrl)}
                        title={`Trailer: ${title}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}
