"use client"

import { useState, useTransition } from "react"
import { reset } from "@/actions/reset"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function ResetPage() {
    const [isPending, startTransition] = useTransition()
    const [success, setSuccess] = useState<string | undefined>("")
    const [error, setError] = useState<string | undefined>("")

    const handleSubmit = (formData: FormData) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            reset(formData)
                .then((data) => {
                    if (data?.error) {
                        setError(data.error)
                        toast.error(data.error)
                    }
                    if (data?.success) {
                        setSuccess(data.success)
                        toast.success(data.success)
                    }
                })
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                    <CardTitle>Quên Mật Khẩu</CardTitle>
                    <CardDescription>Nhập email để nhận link đặt lại mật khẩu</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                disabled={isPending}
                                className="bg-zinc-950 border-zinc-700"
                            />
                        </div>

                        {error && <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded">{error}</div>}
                        {success && <div className="text-green-500 text-sm bg-green-500/10 p-2 rounded">{success}</div>}

                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 font-bold" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Gửi Link Xác Nhận
                        </Button>

                        <div className="text-center text-sm">
                            <Link href="/login" className="text-zinc-400 hover:text-white">
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
