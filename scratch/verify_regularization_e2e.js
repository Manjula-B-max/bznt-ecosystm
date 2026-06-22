import { User } from '../server/models/Auth.js';
import { Employee } from '../server/models/Employee.js';
import { getModel } from '../server/models/Generic.js';
import mongoose from '../server/db.js';

const BASE_URL = 'http://localhost:3001/api';
const EMP_EMAIL = 'testactive@bezent.com';
const MGR_EMAIL = 'manager@bezent.com';
const HR_EMAIL = 'apj3d@admin.com';

async function run() {
    console.log("=== STARTING ATTENDANCE REGULARIZATION E2E INTEGRATION TEST ===");

    const Correction = getModel('hr_corrections');
    const Attendance = getModel('hr_attendance');
    const AuditLog = getModel('hr_audit_logs');

    // Clean up past regularization runs for this test employee
    await Correction.deleteMany({ user_email: EMP_EMAIL });
    await Attendance.deleteMany({ user_email: EMP_EMAIL, date: { $in: ['2026-06-01', '2026-06-02', '2026-06-03'] } });
    await Employee.findOneAndUpdate({ user_email: EMP_EMAIL }, { $set: { late_credits: 40, late_credit_logs: [] } });

    // Step 1: Login as Employee
    console.log(`\n[STEP 1] Logging in as Employee: ${EMP_EMAIL}...`);
    const empLogin = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMP_EMAIL, otp: '123456' })
    }).then(r => r.json());
    const empToken = empLogin.token;
    console.log("Employee login success.");

    // Step 2: Submit Missed Tap In request
    console.log(`\n[STEP 2] Submitting Missed Tap In request...`);
    const req1 = await fetch(`${BASE_URL}/employee/attendance/corrections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${empToken}` },
        body: JSON.stringify({
            date: '2026-06-01',
            category: 'Missed Tap In',
            clock_in_time: '09:15 AM',
            reason: 'Card reader was broken',
            additional_notes: 'Spoke with IT helpdesk'
        })
    }).then(r => r.json());
    console.log("Submission response:", req1);

    // Step 3: Submit Late Arrival request (09:05 AM -> Should deduct 5 credits)
    console.log(`\n[STEP 3] Submitting Late Arrival request (09:05 AM)...`);
    const req2 = await fetch(`${BASE_URL}/employee/attendance/corrections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${empToken}` },
        body: JSON.stringify({
            date: '2026-06-02',
            category: 'Late Arrival',
            arrival_time: '09:05 AM',
            reason: 'Heavy traffic near bridge'
        })
    }).then(r => r.json());
    console.log("Submission response:", req2);

    // Step 4: Submit Late Arrival request (> 09:06 AM -> Half Day)
    console.log(`\n[STEP 4] Submitting Late Arrival request (>09:06 AM)...`);
    const req3 = await fetch(`${BASE_URL}/employee/attendance/corrections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${empToken}` },
        body: JSON.stringify({
            date: '2026-06-03',
            category: 'Late Arrival',
            arrival_time: '09:12 AM',
            reason: 'Personal urgent work'
        })
    }).then(r => r.json());
    console.log("Submission response:", req3);

    // Step 5: Edit Pending Request (edit req1 date and notes)
    console.log(`\n[STEP 5] Editing request req1...`);
    const editRes = await fetch(`${BASE_URL}/employee/attendance/corrections/${req1.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${empToken}` },
        body: JSON.stringify({
            date: '2026-06-01',
            category: 'Missed Tap In',
            clock_in_time: '09:15 AM',
            reason: 'Card reader was broken - corrected description',
            additional_notes: 'Already verified with IT'
        })
    }).then(r => r.json());
    console.log("Edit response:", editRes);

    // Step 6: Cancel Request (cancel req1)
    console.log(`\n[STEP 6] Cancelling request req1...`);
    const cancelRes = await fetch(`${BASE_URL}/employee/attendance/corrections/${req1.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${empToken}` }
    }).then(r => r.json());
    console.log("Cancel response:", cancelRes);

    // Verify req1 status in DB is Cancelled
    const dbReq1 = await Correction.findOne({ id: req1.id });
    console.log("✓ req1 status in DB:", dbReq1.status);
    if (dbReq1.status !== 'Cancelled') throw new Error("Expected req1 status to be Cancelled");

    // Try to edit cancelled request (should fail)
    console.log(`\n[STEP 6b] Attempting to edit cancelled request req1 (should fail)...`);
    const editFailRes = await fetch(`${BASE_URL}/employee/attendance/corrections/${req1.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${empToken}` },
        body: JSON.stringify({
            date: '2026-06-01',
            category: 'Missed Tap In',
            clock_in_time: '09:15 AM',
            reason: 'Hack attempt'
        })
    });
    console.log("Response status (expected 400):", editFailRes.status);
    if (editFailRes.status !== 400) throw new Error("Expected 400 Bad Request on editing non-pending request");

    // Step 7: Login as Manager to approve/reject
    console.log(`\n[STEP 7] Logging in as Manager: ${MGR_EMAIL}...`);
    const mgrLogin = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: MGR_EMAIL, otp: '123456' })
    }).then(r => r.json());
    const mgrToken = mgrLogin.token;
    console.log("Manager login success.");

    // Manager approves req2 (09:05 AM)
    console.log(`\n[STEP 7b] Manager approving req2...`);
    const mgrApproveRes = await fetch(`${BASE_URL}/hr/corrections/${req2.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${mgrToken}` },
        body: JSON.stringify({ action: 'approve', remarks: 'Employee called and informed me. Approved.' })
    }).then(r => r.json());
    console.log("Manager approve response:", mgrApproveRes);

    // Manager rejects req3 (09:12 AM)
    console.log(`\n[STEP 7c] Manager rejecting req3...`);
    const mgrRejectRes = await fetch(`${BASE_URL}/hr/corrections/${req3.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${mgrToken}` },
        body: JSON.stringify({ action: 'reject', remarks: 'Too late. Insufficient justification.' })
    }).then(r => r.json());
    console.log("Manager reject response:", mgrRejectRes);

    // Verify request states in database
    const dbReq2AfterMgr = await Correction.findOne({ id: req2.id });
    console.log("✓ req2 status after Manager Review:", dbReq2AfterMgr.status); // Manager Approved
    const dbReq3AfterMgr = await Correction.findOne({ id: req3.id });
    console.log("✓ req3 status after Manager Review:", dbReq3AfterMgr.status); // Manager Rejected

    // Employee tries to edit Manager Approved request (should fail)
    console.log(`\n[STEP 7d] Employee trying to edit Manager Approved request req2 (should fail)...`);
    const empEditFailRes = await fetch(`${BASE_URL}/employee/attendance/corrections/${req2.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${empToken}` },
        body: JSON.stringify({
            date: '2026-06-02',
            category: 'Late Arrival',
            arrival_time: '09:01 AM',
            reason: 'Changing reason after approval'
        })
    });
    console.log("Response status (expected 400):", empEditFailRes.status);
    if (empEditFailRes.status !== 400) throw new Error("Expected 400 Bad Request on editing manager-approved request");

    // Step 8: Login as HR to final approve/reject
    console.log(`\n[STEP 8] Logging in as HR Admin: ${HR_EMAIL}...`);
    const hrLogin = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: HR_EMAIL, otp: '123456' })
    }).then(r => r.json());
    const hrToken = hrLogin.token;
    console.log("HR login success.");

    // HR approves req2 (Manager Approved)
    console.log(`\n[STEP 8b] HR approving request req2...`);
    const hrApproveRes = await fetch(`${BASE_URL}/hr/corrections/${req2.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${hrToken}` },
        body: JSON.stringify({ action: 'approve', remarks: 'Final approval from HR. Records updated.' })
    }).then(r => r.json());
    console.log("HR approve response:", hrApproveRes);

    // HR attempts to approve req3 (Manager Rejected) -> should fail since manager rejected request is closed
    console.log(`\n[STEP 8c] HR attempting to approve manager-rejected request req3 (should fail)...`);
    const hrApproveFailRes = await fetch(`${BASE_URL}/hr/corrections/${req3.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${hrToken}` },
        body: JSON.stringify({ action: 'approve', remarks: 'HR bypass' })
    });
    console.log("Response status (expected 400):", hrApproveFailRes.status);
    if (hrApproveFailRes.status !== 400) throw new Error("Expected 400 Bad Request on HR attempting to approve closed manager rejection");

    // Step 9: Verify final updates in database
    console.log("\n[STEP 9] Verifying database updates after HR approval...");
    
    // Check request status
    const finalReq2 = await Correction.findOne({ id: req2.id });
    console.log("✓ req2 final status:", finalReq2.status); // HR Approved
    if (finalReq2.status !== 'HR Approved') throw new Error("Expected req2 status to be HR Approved");

    // Check Employee model (late credits log & deductions)
    const empRecord = await Employee.findOne({ user_email: EMP_EMAIL });
    console.log("✓ Employee Remaining Credits:", empRecord.late_credits); // Should be 35 (40 - 5)
    console.log("✓ Employee Late logs:", JSON.stringify(empRecord.late_credit_logs, null, 2));
    if (empRecord.late_credits !== 35) throw new Error("Expected employee credits to be 35");

    // Check Attendance model (corrected punch log exists)
    const attRecord = await Attendance.findOne({ user_email: EMP_EMAIL, date: '2026-06-02' });
    console.log("✓ Updated Attendance record status:", attRecord.status); // Late
    console.log("✓ Updated Attendance clock_in:", attRecord.clock_in); // 09:05 AM
    if (attRecord.status !== 'Late') throw new Error("Expected attendance status to be Late");
    if (attRecord.clock_in !== '09:05 AM') throw new Error("Expected attendance check-in time to be 09:05 AM");

    // Check Audit logs
    const auditLogs = await AuditLog.find({ user_email: HR_EMAIL, action_type: 'Regularization HR Review' });
    console.log(`✓ Found ${auditLogs.length} HR Audit logs for this action.`);
    if (auditLogs.length === 0) throw new Error("Audit log was not created");

    await mongoose.disconnect();
    console.log("\n=== ALL REGULARIZATION WORKFLOW CHECKS PASSED SUCCESSFULLY! ===");
}

run().catch(async (err) => {
    console.error("\n❌ TEST FAILED:", err);
    await mongoose.disconnect();
    process.exit(1);
});
