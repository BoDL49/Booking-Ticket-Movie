"use client"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon, Loader2, Link as LinkIcon } from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
import { toast } from "sonner"

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    disabled?: boolean
}

export function ImageUpload({
    value,
    onChange,
    disabled
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0]
            if (!file) return

            setIsUploading(true)

            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            const data = await res.json()

            if (data.url) {
                onChange(data.url)
                toast.success("Tải ảnh lên thành công!")
            } else {
                toast.error(data.error || "Lỗi khi tải ảnh")
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra khi tải ảnh")
        } finally {
            setIsUploading(false)
        }
    }

    const onRemove = () => {
        onChange("")
    }

    return (
        <div className="space-y-4 w-full flex flex-col items-center justify-center">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-900 border-2 border-dashed border-zinc-800 flex items-center justify-center group">
                {value ? (
                    <>
                        <img
                            src={value}
                            alt="Upload preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={onRemove}
                            className="absolute top-2 right-2 p-1 bg-red-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            type="button"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-zinc-500">
                        {isUploading ? (
                            <Loader2 className="w-10 h-10 animate-spin text-red-600" />
                        ) : (
                            <>
                                <ImageIcon className="w-10 h-10" />
                                <p className="text-xs font-bold uppercase tracking-widest">Xem trước ảnh</p>
                            </>
                        )}
                    </div>
                )}
            </div>

            <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-zinc-800">
                    <TabsTrigger value="upload">Tải ảnh lên</TabsTrigger>
                    <TabsTrigger value="url">Nhập URL</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="mt-4">
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={onUpload}
                        accept="image/*"
                        disabled={disabled || isUploading}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full border-zinc-800 bg-transparent hover:bg-zinc-900 text-zinc-400 hover:text-white gap-2 h-11"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled || isUploading}
                    >
                        <Upload className="w-4 h-4" />
                        {value ? "Thay đổi ảnh bằng cách tải lên" : "Chọn ảnh từ thiết bị"}
                    </Button>
                </TabsContent>

                <TabsContent value="url" className="mt-4 space-y-2">
                    <div className="flex gap-2">
                        <Input
                            placeholder="https://example.com/image.png"
                            disabled={disabled || isUploading}
                            onChange={(e) => onChange(e.target.value)}
                            // We don't bind value here because `value` prop is the finalized URL.
                            // If we bind it, editing it might break the preview immediately if the URL is incomplete.
                            // But usually users expect to see what they typed. 
                            // Let's bind it but user needs to be careful.
                            // Actually, better to debounce or just let it be.
                            // If value IS mapped to this input, then typing changes the preview immediately.
                            value={value}
                            className="bg-zinc-900 border-zinc-800"
                        />
                    </div>
                    <p className="text-[10px] text-zinc-500">Nhập đường dẫn trực tiếp (Direct Link) của ảnh.</p>
                </TabsContent>
            </Tabs>
        </div>
    )
}
