const paypal = require('@paypal/checkout-server-sdk');
console.log('Keys:', Object.keys(paypal));
if (paypal.core) {
    console.log('Core Keys:', Object.keys(paypal.core));
    console.log('OrdersCreateRequest type:', typeof paypal.core.OrdersCreateRequest);
    const hasConstructor = !!paypal.core.OrdersCreateRequest.prototype && !!paypal.core.OrdersCreateRequest.prototype.constructor;
    console.log('OrdersCreateRequest is constructor:', hasConstructor);
} else {
    console.log('paypal.core is undefined');
}
