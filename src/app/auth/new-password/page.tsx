"use client"

import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { newPassword } from "@/actions/new-password"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function NewPasswordPage() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [isPending, startTransition] = useTransition()
    const [success, setSuccess] = useState<string | undefined>("")
    const [error, setError] = useState<string | undefined>("")
    const [isComplete, setIsComplete] = useState(false)

    const handleSubmit = (formData: FormData) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            newPassword(formData, token)
                .then((data) => {
                    if (data?.error) {
                        setError(data.error)
                        toast.error(data.error)
                    }
                    if (data?.success) {
                        setSuccess(data.success)
                        toast.success(data.success)
                        setIsComplete(true)
                    }
                })
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                    <CardTitle>Đặt Mật Khẩu Mới</CardTitle>
                    <CardDescription>Nhập mật khẩu mới của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                    {!isComplete ? (
                        <form action={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mật khẩu mới</label>
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="******"
                                    disabled={isPending}
                                    className="bg-zinc-950 border-zinc-700"
                                />
                            </div>

                            {error && <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded">{error}</div>}
                            {success && <div className="text-green-500 text-sm bg-green-500/10 p-2 rounded">{success}</div>}

                            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 font-bold" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Lưu Mật Khẩu Mới
                            </Button>

                            <div className="text-center text-sm">
                                <Link href="/login" className="text-zinc-400 hover:text-white">
                                    Quay lại đăng nhập
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="text-green-500 text-lg font-bold">Mật khẩu đã được thay đổi!</div>
                            <Button asChild className="w-full bg-red-600 hover:bg-red-700 font-bold">
                                <Link href="/login">Đăng Nhập Ngay</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
