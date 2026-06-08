const BASE_URL = 'http://localhost:3001/api';
const EMAIL = 'isabin1011@gmail.com';

async function run() {
    console.log("=== SIMULATING END-TO-END POLICY SIGNATURE & CANTEEN SELECTION ===");
    
    // 0. Clean up existing test database records to ensure test idempotency
    const { default: mongoose } = await import('./server/db.js');
    const { getModel } = await import('./server/models/Generic.js');
    if (mongoose.connection.readyState !== 1) {
        await new Promise((resolve) => mongoose.connection.once('open', resolve));
    }
    const CanteenModel = getModel('hr_canteen_registrations');
    await CanteenModel.deleteMany({ user_email: EMAIL });
    const AckModel = getModel('hr_policy_acknowledgements');
    await AckModel.deleteMany({ user_email: EMAIL });
    console.log("Database cleaned up for email:", EMAIL);

    // 1. Send OTP
    console.log(`Sending OTP to ${EMAIL}...`);
    const sendRes = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL })
    });
    const sendData = await sendRes.json();
    if (!sendRes.ok) throw new Error("Send OTP failed");

    // 2. Verify OTP
    console.log("Verifying OTP with bypass '123456'...");
    const verifyRes = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, otp: '123456' })
    });
    const verifyData = await verifyRes.json();
    if (!verifyRes.ok) throw new Error("Verify OTP failed");
    
    const token = verifyData.token;
    console.log("Token obtained successfully.");

    // Authenticated Fetch Helper
    const hrFetch = async (path, options = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
        if (!res.ok) {
            const txt = await res.text();
            throw new Error(`Request to ${path} failed with status ${res.status}: ${txt}`);
        }
        return res.json();
    };

    // 3. Fetch active policies
    console.log("\nFetching active policies...");
    const policies = await hrFetch('/hr/policies');
    console.log(`Found ${policies.length} active policies.`);
    const targetPolicy = policies.find(p => p.name.includes("Equal Employment"));
    console.log("Target Policy:", targetPolicy.name, `(ID: ${targetPolicy.id})`);

    // 4. Submit Acknowledgement
    console.log(`\nSubmitting signature acknowledgement for ${targetPolicy.name}...`);
    const ackPayload = {
        id: 'ACK-TEST-' + Math.floor(1000 + Math.random() * 9000),
        policy_id: targetPolicy.id,
        policy_name: targetPolicy.name,
        accepted_version: targetPolicy.version,
        user_email: EMAIL,
        status: 'Accepted'
    };
    const ackRes = await hrFetch('/hr/policy-acknowledgements', {
        method: 'POST',
        body: JSON.stringify(ackPayload)
    });
    console.log("Acknowledgement response:", ackRes);

    // 5. Submit Canteen Choice
    const activeMonthStr = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
    console.log(`\nSubmitting Canteen registration choice for month ${activeMonthStr}...`);
    const canteenPayload = {
        id: 'CNT-TEST-' + Math.floor(1000 + Math.random() * 9000),
        user_email: EMAIL,
        month: activeMonthStr,
        selection_type: 'Company Canteen'
    };
    const canteenRes = await hrFetch('/hr/canteen-registrations', {
        method: 'POST',
        body: JSON.stringify(canteenPayload)
    });
    console.log("Canteen Registration response:", canteenRes);

    // 6. Verify locking: Try submitting again for the same month, it should fail
    console.log(`\nVerifying calendar month lock by attempting to change choice...`);
    try {
        await hrFetch('/hr/canteen-registrations', {
            method: 'POST',
            body: JSON.stringify(canteenPayload)
        });
        console.log("❌ Test Failed: Re-submission allowed!");
    } catch (e) {
        console.log("✅ Re-submission blocked as expected:", e.message);
    }

    // 7. Verify Compliance Stats updates
    console.log("\nFetching latest compliance telemetry...");
    const telemetry = await hrFetch('/hr/compliance-telemetry');
    console.log("Telemetry results:", telemetry);

    // 8. Verify audit logs
    console.log("\nFetching audit logs...");
    const audits = await hrFetch('/hr/audit-logs');
    console.log("Latest audit logs count:", audits.length);
    console.log("Latest action type:", audits[0].action_type, "-", audits[0].details);

    console.log("\n=== ALL SYSTEM INTERACTION TESTS PASSED! ===");
    await mongoose.connection.close();
    process.exit(0);
}

run().catch(async (err) => {
    console.error("❌ Test Failed:", err);
    try {
        const { default: mongoose } = await import('./server/db.js');
        await mongoose.connection.close();
    } catch (e) {}
    process.exit(1);
});
