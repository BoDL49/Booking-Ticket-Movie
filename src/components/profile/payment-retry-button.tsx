"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, CreditCard } from "lucide-react"
import { retryPayment } from "@/actions/payment/retry-payment"
import { toast } from "sonner" // Assuming sonner or use toast from hooks

interface PaymentRetryButtonProps {
    bookingId: string
    createdAt: Date
}

export function PaymentRetryButton({ bookingId, createdAt }: PaymentRetryButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    // Check if expired
    const now = new Date()
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000)
    const isExpired = new Date(createdAt) < thirtyMinutesAgo

    if (isExpired) return null

    const handlePayment = (method: 'payos' | 'vnpay' | 'paypal') => {
        startTransition(async () => {
            const result = await retryPayment(bookingId, method)

            if (result.error) {
                // You might need a toast library here, relying on simple alert for valid MVP if toast not found
                alert(result.error)
            } else if (result.checkoutUrl) {
                window.location.href = result.checkoutUrl
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold"
                >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Thanh Toán Ngay
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle>Chọn phương thức thanh toán</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Vui lòng chọn cổng thanh toán để tiếp tục hoàn tất đơn hàng.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* PayOS Option */}
                    <div
                        onClick={() => handlePayment('payos')}
                        className={`p-4 bg-zinc-950 rounded-lg border border-zinc-700 hover:border-green-500 cursor-pointer transition-all flex items-center justify-between group ${isPending ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-xs">
                                PO
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-white text-sm group-hover:text-green-500 transition-colors">PayOS</p>
                                <p className="text-[10px] text-zinc-400">Ví điện tử, QR Code</p>
                            </div>
                        </div>
                    </div>

                    {/* VNPay Option */}
                    <div
                        onClick={() => handlePayment('vnpay')}
                        className={`p-4 bg-zinc-950 rounded-lg border border-zinc-700 hover:border-green-500 cursor-pointer transition-all flex items-center justify-between group ${isPending ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center text-white font-black text-xs">
                                VN
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-white text-sm group-hover:text-green-500 transition-colors">VNPay</p>
                                <p className="text-[10px] text-zinc-400">Thẻ ATM, Visa, MasterCard</p>
                            </div>
                        </div>
                    </div>

                    {/* PayPal Option */}
                    <div
                        onClick={() => handlePayment('paypal')}
                        className={`p-4 bg-zinc-950 rounded-lg border border-zinc-700 hover:border-green-500 cursor-pointer transition-all flex items-center justify-between group ${isPending ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-[#003087] flex items-center justify-center text-white font-black text-xs">
                                PP
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-white text-sm group-hover:text-green-500 transition-colors">PayPal</p>
                                <p className="text-[10px] text-zinc-400">Thanh toán quốc tế</p>
                            </div>
                        </div>
                    </div>
                </div>

                {isPending && (
                    <div className="flex justify-center p-4">
                        <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
