export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-zinc-100 pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-black uppercase text-white mb-8">Chính sách bảo mật</h1>
                <div className="space-y-6 text-zinc-300 leading-relaxed">
                    <p>BơCinema coi trọng quyền riêng tư của bạn. Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.</p>

                    <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Thông tin thu thập</h2>
                    <p>Chúng tôi thu thập thông tin khi bạn đăng ký tài khoản, đặt vé, hoặc liên hệ với chúng tôi. Thông tin bao gồm tên, email, số điện thoại và lịch sử giao dịch.</p>

                    <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Mục đích sử dụng</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Xử lý đơn đặt hàng vé và bắp nước.</li>
                        <li>Gửi thông tin xác nhận và vé điện tử.</li>
                        <li>Thông báo về các chương trình khuyến mãi (nếu bạn đăng ký nhận tin).</li>
                        <li>Cải thiện chất lượng dịch vụ và trải nghiệm người dùng.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Chia sẻ thông tin</h2>
                    <p>Chúng không bán hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ ba, ngoại trừ các đối tác cung cấp dịch vụ thanh toán hoặc khi có yêu cầu của cơ quan pháp luật.</p>

                    <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Bảo mật</h2>
                    <p>Chúng tôi áp dụng các biện pháp an ninh kỹ thuật để ngăn chặn truy cập trái phép, mất mát hoặc tiêu hủy thông tin cá nhân.</p>
                </div>
            </div>
        </div>
    )
}
