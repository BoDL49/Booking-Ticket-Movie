const crypto = require('crypto');

const secret = 'KQRIYQURN6EN8U162VN8QFR6OK6RTI0S';
const signData = 'vnp_Amount=38000000&vnp_Command=pay&vnp_CreateDate=20260130160129&vnp_CurrCode=VND&vnp_ExpireDate=20260130161629&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=BoCinema%20-%20AI%20TH%C6%AF%C6%A0NG%20AI%20M%E1%BA%BEN%20%23cml0natl&vnp_OrderType=billpayment&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fpayment%2Fvnpay%2Freturn&vnp_TmnCode=22E6OY33&vnp_TxnRef=cml0natlo000nthuyqufe6uq8&vnp_Version=2.1.0';

const hmac = crypto.createHmac('sha512', secret);
const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

console.log('Secret:', secret);
console.log('SignData:', signData);
console.log('Calculated Signature:', signed);
console.log('Expected Signature:  ', '1d43a5217d145099dcb43ed1811852aedbb441a37ef486991b8411c030ebe8127c01d8d5de161cf79afc83b6b300ec62253d9b5c3d99e0f17a43ba719718fa62');
console.log('Match:', signed === '1d43a5217d145099dcb43ed1811852aedbb441a37ef486991b8411c030ebe8127c01d8d5de161cf79afc83b6b300ec62253d9b5c3d99e0f17a43ba719718fa62');
