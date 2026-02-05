const PayOS = require("@payos/node");
console.log("Type of PayOS:", typeof PayOS);
console.log("PayOS exports:", PayOS);
try {
    new PayOS("a", "b", "c");
    console.log("new PayOS() worked");
} catch (e) {
    console.log("new PayOS() failed:", e.message);
}
