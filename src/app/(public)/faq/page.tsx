
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-black text-zinc-100 pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-black uppercase text-white mb-8">Câu hỏi thường gặp</h1>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    <AccordionItem value="item-1" className="border-zinc-800 bg-zinc-900/30 px-4 rounded-lg">
                        <AccordionTrigger className="text-lg font-bold hover:text-green-500 hover:no-underline">Làm thế nào để đặt vé máy?</AccordionTrigger>
                        <AccordionContent className="text-zinc-400">
                            Bạn có thể đặt vé trực tiếp trên website hoặc ứng dụng BơCinema. Chỉ cần chọn phim, chọn suất chiếu, chọn ghế và thanh toán trực tuyến. Vé điện tử sẽ được gửi về email của bạn.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="border-zinc-800 bg-zinc-900/30 px-4 rounded-lg">
                        <AccordionTrigger className="text-lg font-bold hover:text-green-500 hover:no-underline">Tôi có thể hủy hoặc đổi vé không?</AccordionTrigger>
                        <AccordionContent className="text-zinc-400">
                            Rất tiếc, theo quy định, vé đã thanh toán sẽ không được hoàn trả hoặc đổi sang suất chiếu khác. Vui lòng kiểm tra kỹ thông tin trước khi thanh toán.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="border-zinc-800 bg-zinc-900/30 px-4 rounded-lg">
                        <AccordionTrigger className="text-lg font-bold hover:text-green-500 hover:no-underline">Làm sao để đăng ký thành viên?</AccordionTrigger>
                        <AccordionContent className="text-zinc-400">
                            Bạn có thể đăng ký thành viên miễn phí bằng cách nhấn vào nút "Đăng ký" ở góc trên bên phải màn hình. Thành viên BơCinema sẽ nhận được nhiều ưu đãi hấp dẫn.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4" className="border-zinc-800 bg-zinc-900/30 px-4 rounded-lg">
                        <AccordionTrigger className="text-lg font-bold hover:text-green-500 hover:no-underline">Trẻ em có cần mua vé không?</AccordionTrigger>
                        <AccordionContent className="text-zinc-400">
                            Trẻ em cao dưới 0.7m được miễn phí vé (ngồi chung ghế với người lớn). Trẻ em từ 0.7m trở lên cần mua vé theo quy định.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}
