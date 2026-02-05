"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { newVerification } from "@/actions/new-verification"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NewVerificationPage() {
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const onSubmit = useCallback(() => {
        if (success || error) return

        if (!token) {
            setError("Thiếu mã xác thực!")
            return
        }

        newVerification(token).then((data) => {
            setSuccess(data.success)
            setError(data.error)
        }).catch(() => {
            setError("Đã có lỗi xảy ra!")
        })
    }, [token, success, error])

    useEffect(() => {
        onSubmit()
    }, [onSubmit])

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <Card className="w-[400px] bg-zinc-900 border-zinc-800 text-white shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Xác Thực Email</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4">
                    {!success && !error && (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-10 w-10 animate-spin text-red-600" />
                            <p className="text-zinc-400">Đang xác thực...</p>
                        </div>
                    )}

                    {success && (
                        <div className="text-center space-y-4">
                            <div className="text-green-500 font-bold text-lg">{success}</div>
                            <Button asChild className="bg-red-600 hover:bg-red-700 w-full">
                                <Link href="/login">Đăng Nhập Ngay</Link>
                            </Button>
                        </div>
                    )}

                    {error && (
                        <div className="text-center space-y-4">
                            <div className="text-red-500 font-bold text-lg">{error}</div>
                            <Button asChild variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:text-white">
                                <Link href="/">Về Trang Chủ</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
