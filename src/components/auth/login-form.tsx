"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { loginAction } from "@/lib/actions/auth-actions"

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

const loginSchema = z.object({
    email: z.string().email({ message: "Email không hợp lệ" }),
    password: z.string().min(1, { message: "Vui lòng nhập mật khẩu" }),
})

export function LoginForm() {
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    function onSubmit(values: z.infer<typeof loginSchema>) {
        startTransition(() => {
            loginAction(values).then((data) => {
                if (data?.error) {
                    toast.error(data.error)
                } else {
                    // Success managed by redirect in action
                    toast.success("Đang đăng nhập...")
                }
            })
        })
    }

    return (
        <Card className="w-full max-w-md bg-zinc-950 border-zinc-800 text-zinc-100 shadow-2xl">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    Chào Mừng Trở Lại
                </CardTitle>
                <CardDescription className="text-center text-zinc-400">
                    Nhập email để đăng nhập vào tài khoản của bạn
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                    <div className="space-y-1">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                placeholder="******"
                                                disabled={isPending}
                                                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-red-500"
                                            />
                                        </FormControl>
                                        <div className="flex justify-end">
                                            <Button
                                                size="sm"
                                                variant="link"
                                                asChild
                                                className="px-0 font-normal text-zinc-400 hover:text-white"
                                            >
                                                <Link href="/auth/reset">
                                                    Quên mật khẩu?
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)]"
                            disabled={isPending}
                        >
                            {isPending ? "Đang đăng nhập..." : "Đăng Nhập"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-sm text-zinc-500">
                    Chưa có tài khoản?{" "}
                    <Link href="/register" className="text-red-500 hover:text-red-400 font-medium hover:underline">
                        Đăng ký ngay
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
