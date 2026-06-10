const BASE_URL = 'http://localhost:3001/api';
const OWNER_EMAIL = 'apj3d@gmail.com';
const TEST_EMPLOYEE_EMAIL = 'neha@bezent.com';

async function run() {
    console.log("=== VERIFYING WORKSPACE ACCESS DIRECTORY BACKEND CONSTRAINTS ===");

    // Connect to database to get current test data
    const { default: mongoose } = await import('./server/db.js');
    if (mongoose.connection.readyState !== 1) {
        await new Promise((resolve) => mongoose.connection.once('open', resolve));
    }

    // 1. Authenticate as OWNER
    console.log(`\nLogging in as OWNER: ${OWNER_EMAIL}...`);
    const ownerVerifyRes = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: OWNER_EMAIL, otp: '123456' })
    });
    const ownerVerifyData = await ownerVerifyRes.json();
    if (!ownerVerifyRes.ok) throw new Error("Owner verification failed");
    const ownerToken = ownerVerifyData.token;
    console.log("Owner login success. Token obtained.");

    // 2. Authenticate as regular employee (TEST_EMPLOYEE_EMAIL)
    console.log(`\nLogging in as EMPLOYEE: ${TEST_EMPLOYEE_EMAIL}...`);
    const empVerifyRes = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: TEST_EMPLOYEE_EMAIL, otp: '123456' })
    });
    const empVerifyData = await empVerifyRes.json();
    if (!empVerifyRes.ok) throw new Error("Employee verification failed");
    const empToken = empVerifyData.token;
    console.log("Employee login success. Token obtained.");

    // Helper for requests
    const apiRequest = async (token, method, path, body = null) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const res = await fetch(`${BASE_URL}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });
        const status = res.status;
        let data = null;
        try {
            data = await res.json();
        } catch (e) {}
        return { status, data };
    };

    // 3. Test Owner updating workspace access for employee
    console.log("\n[TEST 1] Owner updating employee workspace access (marketflow_access = true)...");
    const accessUpdateRes = await apiRequest(ownerToken, 'PUT', `/auth/users/${encodeURIComponent(TEST_EMPLOYEE_EMAIL)}/access`, {
        marketflow_access: true,
        projectflow_access: false
    });
    console.log("Response status:", accessUpdateRes.status);
    console.log("Response data:", accessUpdateRes.data);
    if (accessUpdateRes.status !== 200 || accessUpdateRes.data.marketflow_access !== true) {
        throw new Error("Owner failed to update employee access");
    }
    console.log("✅ Test 1 Passed!");

    // 4. Test Employee updating another user (should be rejected with 403)
    console.log("\n[TEST 2] Employee attempting to update workspace access (should fail with 403)...");
    const badUpdateRes = await apiRequest(empToken, 'PUT', `/auth/users/${encodeURIComponent(TEST_EMPLOYEE_EMAIL)}/access`, {
        marketflow_access: false
    });
    console.log("Response status:", badUpdateRes.status);
    console.log("Response data:", badUpdateRes.data);
    if (badUpdateRes.status !== 403) {
        throw new Error(`Expected 403, got ${badUpdateRes.status}`);
    }
    console.log("✅ Test 2 Passed!");

    // 5. Test Owner changing employee role to a custom internal role (e.g. HR Manager)
    console.log("\n[TEST 3] Owner updating employee role to 'HR Manager'...");
    const roleUpdateRes = await apiRequest(ownerToken, 'PUT', `/auth/users/${encodeURIComponent(TEST_EMPLOYEE_EMAIL)}/role`, {
        role: 'HR Manager'
    });
    console.log("Response status:", roleUpdateRes.status);
    console.log("Response data:", roleUpdateRes.data);
    if (roleUpdateRes.status !== 200 || roleUpdateRes.data.role !== 'HR Manager') {
        throw new Error("Failed to set role to HR Manager");
    }
    console.log("✅ Test 3 Passed!");

    // 6. Restore Neha to employee role
    console.log("\nRestoring test employee role to Employee...");
    await apiRequest(ownerToken, 'PUT', `/auth/users/${encodeURIComponent(TEST_EMPLOYEE_EMAIL)}/role`, {
        role: 'employee'
    });

    console.log("\n=== ALL WORKSPACE ACCESS VALIDATION TESTS PASSED SUCCESSFULLY ===");
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
