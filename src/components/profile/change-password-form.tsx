"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { changePasswordAction } from "@/actions/change-password"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function ChangePasswordForm() {
    const [isPending, startTransition] = useTransition()
    const [key, setKey] = useState(0) // To reset form after success

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await changePasswordAction(formData)
            if (result.success) {
                toast.success("Đổi mật khẩu thành công!")
                setKey(prev => prev + 1) // Reset form inputs
            } else {
                toast.error(result.error)
            }
        })
    }

    return (
        <form key={key} action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Mật khẩu hiện tại</label>
                <Input
                    type="password"
                    name="currentPassword"
                    placeholder="••••••••"
                    className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-red-600"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Mật khẩu mới</label>
                    <Input
                        type="password"
                        name="newPassword"
                        placeholder="••••••••"
                        className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-red-600"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Xác nhận mật khẩu mới</label>
                    <Input
                        type="password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-red-600"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    type="submit"
                    disabled={isPending}
                    variant="outline"
                    className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
                >
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Đổi Mật Khẩu
                </Button>
            </div>
        </form>
    )
}
