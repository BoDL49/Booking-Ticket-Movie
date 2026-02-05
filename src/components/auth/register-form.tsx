"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { registerAction } from "@/lib/actions/auth-actions"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"

const registerSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export function RegisterForm() {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    function onSubmit(values: z.infer<typeof registerSchema>) {
        startTransition(() => {
            registerAction(values).then((data) => {
                if (data.error) {
                    toast.error(data.error)
                }
                if (data.success) {
                    toast.success("Đăng ký thành công!")
                    router.push("/login")
                }
            })
        })
    }

    return (
        <Card className="w-full max-w-md bg-zinc-950 border-zinc-800 text-zinc-100 shadow-2xl">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    Đăng Ký Tài Khoản
                </CardTitle>
                <CardDescription className="text-center text-zinc-400">
                    Tham gia BơCinema để nhận ưu đãi xem phim
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-300">Họ và Tên</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Nguyễn Văn A"
                                            disabled={isPending}
                                            className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-red-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-300">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="nguyen.van.a@example.com"
                                            type="email"
                                            disabled={isPending}
                                            className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-red-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-300">Mật khẩu</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="******"
                                            disabled={isPending}
                                            className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-red-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)]"
                            disabled={isPending}
                        >
                            {isPending ? "Đang tạo tài khoản..." : "Đăng Ký"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-sm text-zinc-500">
                    Đã có tài khoản?{" "}
                    <Link href="/login" className="text-red-500 hover:text-red-400 font-medium hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
