import crypto from 'crypto'

interface VNPayConfig {
    tmnCode: string
    hashSecret: string
    url: string
    returnUrl: string
}

interface PaymentParams {
    amount: number
    orderInfo: string
    orderType: string
    txnRef: string
    ipAddr?: string
}

export class VNPay {
    private config: VNPayConfig

    constructor(config: VNPayConfig) {
        this.config = config

        // Debug config to ensure env vars are loaded
        if (typeof window === 'undefined') {
            console.log('VNPay Config Loaded:', {
                tmnCode: this.config.tmnCode,
                url: this.config.url,
                returnUrl: this.config.returnUrl,
                hasSecret: !!this.config.hashSecret,
                secretLength: this.config.hashSecret?.length
            })
        }
    }

    /**
     * Sort object keys alphabetically
     */
    private sortObject(obj: any): any {
        const sorted: any = {}
        const keys = Object.keys(obj).sort()
        keys.forEach(key => {
            sorted[key] = obj[key]
        })
        return sorted
    }

    /**
     * Create HMAC SHA512 signature
     */
    private createSignature(data: string): string {
        const hmac = crypto.createHmac('sha512', this.config.hashSecret)
        return hmac.update(Buffer.from(data, 'utf-8')).digest('hex')
    }

    /**
     * Create VNPay payment URL
     */
    createPaymentUrl(params: PaymentParams): string {
        const date = new Date()
        const createDate = this.formatDate(date)
        const expireDate = this.formatDate(new Date(date.getTime() + 15 * 60 * 1000)) // 15 minutes

        // Ensure amount is integer
        const amount = Math.floor(params.amount)

        let vnpParams: any = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: this.config.tmnCode,
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: params.txnRef,
            vnp_OrderInfo: params.orderInfo,
            vnp_OrderType: params.orderType,
            vnp_Amount: amount * 100, // VNPay requires amount in smallest unit (VND * 100)
            vnp_ReturnUrl: this.config.returnUrl,
            vnp_IpAddr: params.ipAddr || '127.0.0.1',
            vnp_CreateDate: createDate,
            vnp_ExpireDate: expireDate,
        }

        // Sort parameters
        vnpParams = this.sortObject(vnpParams)

        console.log('VNPay Create Params (Sorted):', vnpParams)

        // Create query string
        const queryString = Object.keys(vnpParams)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(vnpParams[key])}`)
            .join('&')

        // Create signature
        const signData = queryString
        const signature = this.createSignature(signData)

        console.log('VNPay Create Signature Source:', signData)
        console.log('VNPay Create Signature:', signature)

        // Build final URL
        return `${this.config.url}?${queryString}&vnp_SecureHash=${signature}`
    }

    /**
     * Verify return URL signature
     */
    verifyReturnUrl(query: any): { isValid: boolean; responseCode?: string } {
        const secureHash = query.vnp_SecureHash
        const secureHashType = query.vnp_SecureHashType

        // Remove hash params before signing
        delete query.vnp_SecureHash
        delete query.vnp_SecureHashType

        // Sort and create signature
        const sortedParams = this.sortObject(query)

        // Debug logging
        console.log('VNPay Verify Query Cleaned:', sortedParams)

        const queryString = Object.keys(sortedParams)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(sortedParams[key])}`)
            .join('&')

        // Log the string being signed to check for encoding issues
        console.log('VNPay Verify Signing String:', queryString)

        const signature = this.createSignature(queryString)

        console.log('VNPay Verify Signature:', {
            calculated: signature,
            received: secureHash
        })

        return {
            isValid: signature.toLowerCase() === secureHash?.toLowerCase(),
            responseCode: query.vnp_ResponseCode
        }
    }

    /**
     * Format date to VNPay format (yyyyMMddHHmmss)
     */
    private formatDate(date: Date): string {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hour = String(date.getHours()).padStart(2, '0')
        const minute = String(date.getMinutes()).padStart(2, '0')
        const second = String(date.getSeconds()).padStart(2, '0')
        return `${year}${month}${day}${hour}${minute}${second}`
    }

    /**
     * Get response message from response code
     */
    static getResponseMessage(responseCode: string): string {
        const messages: { [key: string]: string } = {
            '00': 'Giao dịch thành công',
            '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
            '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
            '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
            '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
            '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
            '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
            '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
            '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
            '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
            '75': 'Ngân hàng thanh toán đang bảo trì.',
            '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
            '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
        }
        return messages[responseCode] || 'Lỗi không xác định'
    }
}

// Export singleton instance
export const vnpay = new VNPay({
    tmnCode: (process.env.VNPAY_TMN_CODE || '').trim(),
    hashSecret: (process.env.VNPAY_HASH_SECRET || '').trim(),
    url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/vnpay/return`
})
