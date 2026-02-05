const paypal = require('@paypal/checkout-server-sdk');
console.log('Orders Keys:', Object.keys(paypal.orders));
if (paypal.orders.OrdersCreateRequest) {
    console.log('Found in orders!');
}
