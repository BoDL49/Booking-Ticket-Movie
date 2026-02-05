"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { SeatMap, Seat } from "@/components/booking/seat-map"
import { ConcessionsSelection, ProductItem } from "@/components/booking/concessions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle2, Ticket, Popcorn, Loader2, AlertTriangle } from "lucide-react"
import { createBooking } from "@/actions/create-booking"

interface BookingClientProps {
    showtime: any
    seats: Seat[]
    concessions: any[]
}

type BookingStep = 'SEAT' | 'FOOD' | 'PAYMENT'

export function BookingClient({ showtime, seats, concessions }: BookingClientProps) {
    const router = useRouter()
    const [step, setStep] = useState<BookingStep>('SEAT')
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
    const [selectedProducts, setSelectedProducts] = useState<ProductItem[]>([])

    // Payment State
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [paymentMethod, setPaymentMethod] = useState<'payos' | 'vnpay' | 'paypal'>('payos')

    const timeFormatted = new Date(showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    const dateFormatted = new Date(showtime.startTime).toLocaleDateString('vi-VN')

    // Calculate Totals
    const seatsTotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
    const productsTotal = selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const grandTotal = seatsTotal + productsTotal

    const handleContinue = () => {
        if (step === 'SEAT') setStep('FOOD')
        else if (step === 'FOOD') setStep('PAYMENT')
        else if (step === 'PAYMENT') {
            handlePayment()
        }
    }

    const handlePayment = () => {
        setError(null)
        startTransition(async () => {
            const result = await createBooking(
                showtime.id,
                selectedSeats.map(s => s.id),
                selectedProducts.map(p => ({ id: p.id, quantity: p.quantity, price: p.price })),
                grandTotal,
                paymentMethod
            )

            if (result.error) {
                setError(result.error)
            } else if (result.checkoutUrl) {
                // Redirect to payment gateway
                window.location.href = result.checkoutUrl
            }
        })
    }

    const handleBack = () => {
        setError(null)
        if (step === 'FOOD') setStep('SEAT')
        if (step === 'PAYMENT') setStep('FOOD')
    }

    // Determine current progress index
    const steps = ['SEAT', 'FOOD', 'PAYMENT']
    const currentStepIndex = steps.indexOf(step)

    return (
        <main className="flex-1 container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 mt-16">
            {/* Left: Wizard Content */}
            <div className="flex-1">
                {/* Header / Stepper */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 text-sm font-bold text-zinc-500 mb-4">
                        <div className={`flex items-center gap-2 ${currentStepIndex >= 0 ? "text-green-500" : ""}`}>
                            <span className="flex items-center justify-center w-6 h-6 rounded-full border border-current text-xs">1</span>
                            <span>Chọn Ghế</span>
                        </div>
                        <div className="h-px w-8 bg-zinc-800" />
                        <div className={`flex items-center gap-2 ${currentStepIndex >= 1 ? "text-green-500" : ""}`}>
                            <span className="flex items-center justify-center w-6 h-6 rounded-full border border-current text-xs">2</span>
                            <span>Bắp Nước</span>
                        </div>
                        <div className="h-px w-8 bg-zinc-800" />
                        <div className={`flex items-center gap-2 ${currentStepIndex >= 2 ? "text-green-500" : ""}`}>
                            <span className="flex items-center justify-center w-6 h-6 rounded-full border border-current text-xs">3</span>
                            <span>Thanh Toán</span>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-white uppercase">
                        {step === 'SEAT' && "Chọn Ghế Ngồi"}
                        {step === 'FOOD' && "Chọn Combo Ưu Đãi"}
                        {step === 'PAYMENT' && "Xác Nhận Thanh Toán"}
                    </h1>
                    <p className="text-zinc-400">
                        {showtime.movie?.title} - {showtime.hall?.name}
                    </p>
                </div>

                {/* Step Content */}
                <div className="min-h-[500px]">
                    {step === 'SEAT' && (
                        <SeatMap initialSeats={seats} onSelectionChange={setSelectedSeats} />
                    )}
                    {step === 'FOOD' && (
                        <ConcessionsSelection products={concessions} onSelectionChange={setSelectedProducts} />
                    )}
                    {step === 'PAYMENT' && (
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center space-y-6">
                            <div className="space-y-2">
                                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                                <h3 className="text-xl font-bold text-white">Chọn phương thức thanh toán</h3>
                                <p className="text-zinc-400 max-w-md mx-auto">
                                    Vui lòng chọn cổng thanh toán và kiểm tra kỹ thông tin trước khi tiếp tục.
                                </p>
                            </div>

                            {/* Warning Hold Time */}
                            <div className="bg-yellow-900/20 border border-yellow-900/50 rounded-lg p-4 flex items-start gap-3 text-left max-w-md mx-auto">
                                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="font-medium text-yellow-500 text-sm">Lưu ý quan trọng</p>
                                    <p className="text-yellow-200/80 text-xs leading-relaxed">
                                        Sau khi bấm thanh toán, vé của bạn sẽ được giữ trong vòng <span className="text-yellow-100 font-bold">30 phút</span>. Nếu quá thời gian này mà chưa hoàn tất, vé sẽ tự động bị huỷ.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 max-w-sm mx-auto">
                                {/* PayOS Option */}
                                <div
                                    onClick={() => setPaymentMethod('payos')}
                                    className={`p-4 bg-zinc-950 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'payos'
                                        ? 'border-green-600 ring-2 ring-green-600/50'
                                        : 'border-zinc-700 hover:border-zinc-600'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-xs">
                                            PO
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-white text-sm">PayOS</p>
                                            <p className="text-[10px] text-zinc-400">Ví điện tử, QR Code</p>
                                        </div>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 transition-all ${paymentMethod === 'payos'
                                        ? 'border-green-500 bg-green-500'
                                        : 'border-zinc-700'
                                        }`} />
                                </div>

                                {/* VNPay Option */}
                                <div
                                    onClick={() => setPaymentMethod('vnpay')}
                                    className={`p-4 bg-zinc-950 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'vnpay'
                                        ? 'border-green-600 ring-2 ring-green-600/50'
                                        : 'border-zinc-700 hover:border-zinc-600'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center text-white font-black text-xs">
                                            VN
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-white text-sm">VNPay</p>
                                            <p className="text-[10px] text-zinc-400">Thẻ ATM, Visa, MasterCard</p>
                                        </div>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 transition-all ${paymentMethod === 'vnpay'
                                        ? 'border-green-500 bg-green-500'
                                        : 'border-zinc-700'
                                        }`} />
                                </div>

                                {/* PayPal Option */}
                                <div
                                    onClick={() => setPaymentMethod('paypal')}
                                    className={`p-4 bg-zinc-950 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'paypal'
                                        ? 'border-green-600 ring-2 ring-green-600/50'
                                        : 'border-zinc-700 hover:border-zinc-600'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-[#003087] flex items-center justify-center text-white font-black text-xs">
                                            PP
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-white text-sm">PayPal</p>
                                            <p className="text-[10px] text-zinc-400">Thanh toán quốc tế</p>
                                        </div>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 transition-all ${paymentMethod === 'paypal'
                                        ? 'border-green-500 bg-green-500'
                                        : 'border-zinc-700'
                                        }`} />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm">
                                    {error}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Summary */}
            <div className="w-full lg:w-96">
                <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 sticky top-24 shadow-2xl">
                    <CardHeader className="pb-4">
                        <CardTitle>Tổng Kết Đặt Vé</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="space-y-1">
                            <h3 className="font-bold text-white text-lg leading-tight">{showtime.movie?.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-zinc-400">
                                <Badge variant="outline" className="text-zinc-400 border-zinc-700">{showtime.format === 'TWO_D' ? '2D' : '3D'}</Badge>
                                <Badge variant="outline" className="text-zinc-400 border-zinc-700 bg-green-600/10 text-green-500 border-green-500/20">C16</Badge>
                            </div>
                        </div>

                        <Separator className="bg-zinc-800" />

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                            <div className="text-zinc-500">Rạp chiếu</div>
                            <div className="text-zinc-200 text-right font-medium">{showtime.hall?.name}</div>

                            <div className="text-zinc-500">Suất chiếu</div>
                            <div className="text-zinc-200 text-right font-medium">
                                <span className="text-green-500 font-bold">{timeFormatted}</span> • {dateFormatted}
                            </div>

                            <div className="text-zinc-500">Ghế ({selectedSeats.length})</div>
                            <div className="text-zinc-200 text-right font-medium break-words">
                                {selectedSeats.length > 0 ? (
                                    selectedSeats.map(s => s.row + s.number).join(', ')
                                ) : (
                                    "Let's pick!"
                                )}
                            </div>
                        </div>

                        {/* Selected Food */}
                        {selectedProducts.length > 0 && (
                            <>
                                <Separator className="bg-zinc-800" />
                                <div className="space-y-2">
                                    <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-2">Bắp nước</div>
                                    {selectedProducts.map(p => (
                                        <div key={p.id} className="flex justify-between text-sm">
                                            <span className="text-zinc-300">
                                                <span className="text-green-500 font-bold mr-1">{p.quantity}x</span>
                                                {p.name}
                                            </span>
                                            <span className="text-zinc-400">{(p.price * p.quantity).toLocaleString('vi-VN')}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                    </CardContent>

                    <CardFooter className="flex-col gap-3 bg-zinc-950/80 p-6 rounded-b-xl border-t border-zinc-800 backdrop-blur-md">
                        <div className="flex w-full justify-between items-end">
                            <span className="text-zinc-400 text-sm pb-1">Tạm tính</span>
                            <span className="text-3xl font-black text-green-500 tracking-tight">
                                {grandTotal.toLocaleString('vi-VN')} <span className="text-base font-medium text-zinc-500">đ</span>
                            </span>
                        </div>

                        <div className="flex gap-3 w-full mt-2">
                            {step !== 'SEAT' && (
                                <Button
                                    variant="outline"
                                    className="px-4 border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                                    onClick={handleBack}
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            )}
                            <Button
                                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold h-12 shadow-[0_0_20px_rgba(22,163,74,0.4)] disabled:opacity-50 transition-all"
                                disabled={selectedSeats.length === 0 || isPending}
                                onClick={handleContinue}
                            >
                                {isPending ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Đang xử lý...</span>
                                    </div>
                                ) : (
                                    step === 'PAYMENT' ? "Thanh Toán Ngay" : "Tiếp Tục"
                                )}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </main>
    )
}

