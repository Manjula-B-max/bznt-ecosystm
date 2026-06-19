import { User, OtpCode } from './server/models/Auth.js';
import { Employee } from './server/models/Employee.js';
import { getModel } from './server/models/Generic.js';

const BASE_URL = 'http://localhost:3001/api';
const OWNER_EMAIL = 'isabin1011@gmail.com';
const TEST_EMAIL = 'test-ob@bezent.com';

async function run() {
    console.log("=== STARTING ONBOARDING MODULE E2E INTEGRATION TEST ===");

    // Connect to database to clean up any past test runs
    const { default: mongoose } = await import('./server/db.js');
    console.log("Database connected. Cleaning up past test runs...");
    await User.deleteMany({ email: TEST_EMAIL });
    await Employee.deleteMany({ user_email: TEST_EMAIL });
    await getModel('employee_onboarding').deleteMany({ user_email: TEST_EMAIL });
    await getModel('employee_documents').deleteMany({ user_email: TEST_EMAIL });
    await getModel('employee_policy_acknowledgements').deleteMany({ user_email: TEST_EMAIL });
    await getModel('employee_verification_logs').deleteMany({ employee_id: { $regex: '^EMP_TEST' } });

    // 1. Login as Owner
    console.log(`\n[STEP 1] Logging in as HR Owner: ${OWNER_EMAIL}...`);
    const ownerLoginRes = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: OWNER_EMAIL, otp: '123456' })
    });
    if (!ownerLoginRes.ok) {
        throw new Error(`Owner login failed: ${await ownerLoginRes.text()}`);
    }
    const { token: ownerToken } = await ownerLoginRes.json();
    console.log("Owner login success. Token obtained.");

    // 2. HR adds the employee (simulating admin.html modal form submit)
    console.log("\n[STEP 2] HR creating new employee profile via API...");
    const createEmpRes = await fetch(`${BASE_URL}/hr/employees`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ownerToken}`
        },
        body: JSON.stringify({
            name: 'Rahul Sabin',
            user_email: TEST_EMAIL,
            title: 'Lead Software Engineer',
            department: 'Engineering',
            salary: 150000,
            joined_date: '2026-06-19',
            status: 'Active',
            gender: 'Male'
        })
    });
    if (!createEmpRes.ok) {
        throw new Error(`Employee creation failed: ${await createEmpRes.text()}`);
    }
    const createEmpData = await createEmpRes.json();
    console.log(`Employee created! ID: ${createEmpData.employee_id}, DB ID: ${createEmpData.id}`);

    // Verify employee record exists in database
    const dbEmp = await Employee.findOne({ user_email: TEST_EMAIL });
    if (!dbEmp) throw new Error("Employee record was not created in MongoDB");
    console.log("Retrieved dbEmp details:", JSON.stringify(dbEmp, null, 2));
    console.log("✓ Employee found in DB with onboarding_status:", dbEmp.onboarding_status);
    console.log("✓ Employee type defaulted to:", dbEmp.employee_type);
    console.log("✓ Designation mapped to:", dbEmp.designation);

    // Verify associated User record was created in database
    const dbUser = await User.findOne({ email: TEST_EMAIL });
    if (!dbUser) throw new Error("User record was not auto-created in MongoDB");
    console.log("✓ User record found with employee_access:", dbUser.employee_access);

    // 3. Log in as the new employee (using OTP bypass 123456)
    console.log(`\n[STEP 3] Logging in as new employee: ${TEST_EMAIL}...`);
    const empLoginRes = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: TEST_EMAIL, otp: '123456' })
    });
    if (!empLoginRes.ok) {
        throw new Error(`Employee login failed: ${await empLoginRes.text()}`);
    }
    const { token: empToken } = await empLoginRes.json();
    console.log("Employee login success. Token obtained.");

    // 4. Retrieve onboarding status for employee
    console.log("\n[STEP 4] Fetching onboarding status for logged-in employee...");
    const statusRes = await fetch(`${BASE_URL}/employee/onboarding/status`, {
        headers: { 'Authorization': `Bearer ${empToken}` }
    });
    const statusData = await statusRes.json();
    console.log("Onboarding Status response:", JSON.stringify(statusData, null, 2));
    if (statusData.onboarding_status !== 'Pending Onboarding') {
        throw new Error(`Expected Pending Onboarding, got ${statusData.onboarding_status}`);
    }
    console.log("✓ Correctly returned onboarding status.");

    // 5. Submit Personal Information (Step 1)
    console.log("\n[STEP 5] Submitting Step 1: Personal Information...");
    const step1Res = await fetch(`${BASE_URL}/employee/onboarding/personal-info`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${empToken}`
        },
        body: JSON.stringify({
            dob: '1998-05-15',
            gender: 'Male',
            blood_group: 'O+',
            marital_status: 'Single',
            nationality: 'Indian',
            personal_email: 'rahul.personal@gmail.com',
            mobile: '+91 9876543210',
            alternate_mobile: '+91 9876543211',
            permanent_address: {
                line: '123 Main St, Tech Zone',
                city: 'Bengaluru',
                state: 'Karnataka',
                country: 'India',
                pin: '560001'
            },
            current_address: {
                line: '123 Main St, Tech Zone',
                city: 'Bengaluru',
                state: 'Karnataka',
                country: 'India',
                pin: '560001'
            },
            emergency_contacts: [
                { name: 'Sabin Senior', relationship: 'Father', mobile: '+91 9999999999', type: 'primary' },
                { name: 'Sabin Sister', relationship: 'Sibling', mobile: '+91 8888888888', type: 'secondary' }
            ]
        })
    });
    if (!step1Res.ok) throw new Error(`Step 1 submission failed: ${await step1Res.text()}`);
    console.log("✓ Step 1 submitted successfully.");

    // 6. Submit Document metadata (Step 2)
    console.log("\n[STEP 6] Saving Step 2 document attachments...");
    const docs = [
        { doc_type: 'passport_photo', doc_label: 'Passport Size Photo', file_url: '/uploads/onboarding/test/photo.jpg', file_name: 'photo.jpg' },
        { doc_type: 'aadhaar', doc_label: 'Aadhaar Card', file_url: '/uploads/onboarding/test/aadhaar.pdf', file_name: 'aadhaar.pdf' },
        { doc_type: 'pan', doc_label: 'PAN Card', file_url: '/uploads/onboarding/test/pan.pdf', file_name: 'pan.pdf' }
    ];
    for (const doc of docs) {
        const docRes = await fetch(`${BASE_URL}/employee/onboarding/documents/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${empToken}`
            },
            body: JSON.stringify(doc)
        });
        if (!docRes.ok) throw new Error(`Failed to save doc metadata for ${doc.doc_type}`);
    }
    console.log("✓ Step 2 document metadata saved successfully.");

    // 7. Submit Bank Details (Step 3)
    console.log("\n[STEP 7] Submitting Step 3: Bank & Payroll...");
    const step3Res = await fetch(`${BASE_URL}/employee/onboarding/bank-details`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${empToken}`
        },
        body: JSON.stringify({
            bank_holder_name: 'Rahul Sabin',
            bank_name: 'HDFC Bank',
            bank_account_number: '50100012345678',
            bank_ifsc: 'HDFC0000123',
            bank_branch: 'Koramangala',
            bank_account_type: 'Savings',
            uan_exists: false,
            esi_exists: false
        })
    });
    if (!step3Res.ok) throw new Error(`Step 3 Bank details failed: ${await step3Res.text()}`);
    console.log("✓ Step 3 bank details submitted successfully.");

    // 8. Submit Policies & Digital Signature (Step 4)
    console.log("\n[STEP 8] Submitting Step 4: Company Policies & E-Sign...");
    const step4Res = await fetch(`${BASE_URL}/employee/onboarding/policy-acknowledge`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${empToken}`
        },
        body: JSON.stringify({
            acknowledgements: {
                ack_handbook: true,
                ack_policies: true,
                ack_confidential: true,
                ack_data_security: true,
                ack_accurate: true
            },
            policies_read: ['handbook', 'code_conduct', 'attendance', 'leave', 'it_security', 'data_privacy', 'posh', 'nda', 'confidential'],
            esign_confirmed: true,
            esign_timestamp: new Date().toISOString()
        })
    });
    if (!step4Res.ok) throw new Error(`Step 4 Policies failed: ${await step4Res.text()}`);
    console.log("✓ Step 4 Policies and digital signature submitted successfully.");

    // 9. Final Onboarding Submission (Step 5)
    console.log("\n[STEP 9] Submitting final onboarding application...");
    const submitRes = await fetch(`${BASE_URL}/employee/onboarding/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${empToken}`
        },
        body: JSON.stringify({})
    });
    if (!submitRes.ok) throw new Error(`Final submission failed: ${await submitRes.text()}`);
    const submitData = await submitRes.json();
    console.log("Final submission response:", JSON.stringify(submitData, null, 2));

    // Verify status changes to Pending HR Verification in DB
    const finalDbEmp = await Employee.findOne({ user_email: TEST_EMAIL });
    console.log("✓ Employee onboarding status in DB is now:", finalDbEmp.onboarding_status);
    if (finalDbEmp.onboarding_status !== 'Pending HR Verification') {
        throw new Error("Onboarding status did not progress to Pending HR Verification");
    }

    // 10. HR reviews the Verification Queue (simulating hr-admin.html)
    console.log("\n[STEP 10] HR reading verification queue...");
    const queueRes = await fetch(`${BASE_URL}/employee/onboarding/hr/queue`, {
        headers: { 'Authorization': `Bearer ${ownerToken}` }
    });
    if (!queueRes.ok) throw new Error("Failed to get verification queue");
    const queueData = await queueRes.json();
    console.log(`Onboarding queue length: ${queueData.length}`);
    const pendingEmp = queueData.find(e => e.user_email === TEST_EMAIL);
    if (!pendingEmp) throw new Error("Created employee not found in HR verification queue");
    console.log("✓ Found employee in verification queue. Employee name:", pendingEmp.name);

    // 11. HR approves the onboarding
    console.log(`\n[STEP 11] HR approving onboarding for employee ID: ${pendingEmp.employee_id}...`);
    const approveRes = await fetch(`${BASE_URL}/employee/onboarding/hr/detail/${pendingEmp.employee_id}/approve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ownerToken}`
        },
        body: JSON.stringify({ remarks: 'All credentials and documents checked. Welcome!' })
    });
    if (!approveRes.ok) throw new Error("HR onboarding approval failed");
    const approveData = await approveRes.json();
    console.log("HR approval response:", JSON.stringify(approveData, null, 2));

    // 12. Verify employee's onboarding status is now Approved
    console.log("\n[STEP 12] Re-fetching employee's onboarding status to confirm unlock...");
    const finalStatusRes = await fetch(`${BASE_URL}/employee/onboarding/status`, {
        headers: { 'Authorization': `Bearer ${empToken}` }
    });
    const finalStatusData = await finalStatusRes.json();
    console.log("Final employee onboarding status:", finalStatusData.onboarding_status);
    if (finalStatusData.onboarding_status !== 'Approved') {
        throw new Error(`Expected Approved status, got ${finalStatusData.onboarding_status}`);
    }
    console.log("✓ Portal is successfully unlocked for the employee!");

    // Clean up test data
    console.log("\nCleaning up test databases...");
    await User.deleteMany({ email: TEST_EMAIL });
    await Employee.deleteMany({ user_email: TEST_EMAIL });
    await getModel('employee_onboarding').deleteMany({ user_email: TEST_EMAIL });
    await getModel('employee_documents').deleteMany({ user_email: TEST_EMAIL });
    await getModel('employee_policy_acknowledgements').deleteMany({ user_email: TEST_EMAIL });
    await getModel('employee_verification_logs').deleteMany({ employee_id: pendingEmp.employee_id });

    console.log("\n=======================================================");
    console.log("🎉 ALL E2E ONBOARDING INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉");
    console.log("=======================================================");

    mongoose.connection.close();
    process.exit(0);
}

run().catch(async (err) => {
    console.error("\n❌ Test Failed:", err);
    try {
        await mongoose.connection.close();
    } catch (_) {}
    process.exit(1);
});
