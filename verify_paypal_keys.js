const fs = require('fs');
const path = require('path');

// Load .env manually to ensure we get the values without relying on build system
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const envVars = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        envVars[key] = value;
    }
});

const clientId = envVars.PAYPAL_CLIENT_ID;
const clientSecret = envVars.PAYPAL_CLIENT_SECRET;

console.log('Testing PayPal Sandbox Auth...');
console.log(`Client ID: ${clientId ? clientId.substring(0, 5) + '...' : 'MISSING'}`);
console.log(`Client Secret: ${clientSecret ? 'PRESENT' : 'MISSING'}`);

async function verify() {
    if (!clientId || !clientSecret) {
        console.error('ERROR: Credentials missing in .env');
        return;
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${auth}`
            },
            body: 'grant_type=client_credentials'
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ SUCCESS: Authentication successful!');
            console.log('Access Token obtained.');
            console.log('Scope:', data.scope);
        } else {
            console.error('❌ FAILED: PayPal API rejected credentials.');
            console.error('Status:', response.status);
            console.error('Response:', JSON.stringify(data, null, 2));
            console.log('\nPossible causes:');
            console.log('1. You are using LIVE credentials but targeting SANDBOX.');
            console.log('2. The Client ID or Secret is incorrect.');
            console.log('3. There are accidentally whitespace characters in your .env file.');
        }
    } catch (error) {
        console.error('❌ NETWORK ERROR:', error.message);
    }
}

verify();
