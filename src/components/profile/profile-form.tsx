"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateProfileAction } from "@/actions/update-profile"
import { resendVerificationAction } from "@/actions/resend-verification"
import { toast } from "sonner"
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react"

interface ProfileFormProps {
    user: {
        name?: string | null
        image?: string | null
        email?: string | null
        phone?: string | null
        birthday?: Date | null
        loyaltyPoints?: number
        emailVerified?: Date | null
    }
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition()
    const [isResending, startResend] = useTransition()
    const [preview, setPreview] = useState(user.image || "/placeholder-avatar.jpg")

    const handleResendVerification = () => {
        startResend(async () => {
            const result = await resendVerificationAction()
            if (result.success) {
                toast.success("Đã gửi email xác thực! Vui lòng kiểm tra hộp thư.")
            } else {
                toast.error(result.error || "Gửi thất bại")
            }
        })
    }

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await updateProfileAction(formData)
            if (result.success) {
                toast.success("Cập nhật thông tin thành công!")
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)
        }
    }

    // Format Date for Input Date (YYYY-MM-DD)
    const defaultDate = user.birthday
        ? new Date(user.birthday).toISOString().split('T')[0]
        : ""

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Ảnh đại diện</label>
                <div className="flex gap-4 items-center">
                    <div className="shrink-0 h-16 w-16 rounded-full border border-zinc-700 overflow-hidden bg-zinc-800">
                        <img src={preview} className="h-full w-full object-cover" alt="Avatar" />
                    </div>
                    <div className="flex-1">
                        <Input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="bg-zinc-950 border-zinc-800 text-white file:text-white file:bg-zinc-800 file:border-0 file:mr-4 file:py-1 file:px-2 file:rounded-md hover:file:bg-zinc-700"
                        />
                        <p className="text-xs text-zinc-500 mt-1">Hỗ trợ định dạng JPG, PNG, WEBP.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Họ và tên</label>
                    <Input
                        name="name"
                        defaultValue={user.name || ""}
                        placeholder="Nhập họ tên của bạn"
                        className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-green-600"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300 flex justify-between">
                        Email
                        {user.emailVerified ? (
                            <span className="text-green-500 text-xs flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Đã xác thực
                            </span>
                        ) : (
                            <span className="text-yellow-500 text-xs flex items-center gap-1 cursor-pointer hover:underline" onClick={handleResendVerification}>
                                {/* Button Logic could be here or outside label */}
                                <AlertTriangle className="w-3 h-3" /> Chưa xác thực
                            </span>
                        )}
                    </label>
                    <div className="flex gap-2">
                        <Input
                            value={user.email || ""}
                            disabled
                            className="bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed flex-1"
                        />
                        {!user.emailVerified && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isResending}
                                onClick={handleResendVerification}
                                className="border-yellow-600/50 text-yellow-500 hover:bg-yellow-600/10 whitespace-nowrap"
                            >
                                {isResending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Gửi lại"}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Số điện thoại</label>
                    <Input
                        name="phone"
                        defaultValue={user.phone || ""}
                        placeholder="Thêm số điện thoại"
                        className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-green-600"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Ngày sinh</label>
                    <Input
                        type="date"
                        name="birthday"
                        defaultValue={defaultDate}
                        className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-green-600 block"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold"
                >
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Lưu Thay Đổi
                </Button>
            </div>
        </form>
    )
}
