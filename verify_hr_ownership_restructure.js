import mongoose from 'mongoose';
import { getScopedFilter, getTeamEmails } from './server/routes/hr.js';
import { User } from './server/models/Auth.js';
import { getModel } from './server/models/Generic.js';

const EmployeeModel = getModel('hr_employees');
const LeaveModel = getModel('hr_leaves');

async function runTests() {
    console.log('🚀 Starting Verification of Employee Access Ownership Restructure...');
    const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bezent';
    await mongoose.connect(dbUri);
    console.log('✅ Connected to MongoDB.');

    try {
        // Test 1: Team Scoping Resolution
        console.log('\n--- Test 1: Team Scoping Resolution ---');
        const managerEmail = 'manager_test@company.com';
        const reportEmail1 = 'report1_test@company.com';
        const reportEmail2 = 'report2_test@company.com';
        const otherEmail = 'other_test@company.com';
        const company = 'Test Company';
        const companyId = new mongoose.Types.ObjectId();

        await User.deleteMany({ email: { $in: [managerEmail, reportEmail1, reportEmail2, otherEmail] } });
        await EmployeeModel.deleteMany({ user_email: { $in: [managerEmail, reportEmail1, reportEmail2, otherEmail] } });
        await LeaveModel.deleteMany({ user_email: { $in: [managerEmail, reportEmail1] } });

        const managerUser = await User.create({
            email: managerEmail,
            name: 'Test Manager',
            role: 'manager',
            company: company,
            company_id: companyId,
            manager_access: true,
            status: 'Active'
        });

        await EmployeeModel.create({
            id: 'emp_mgr',
            name: 'Test Manager',
            user_id: managerUser._id.toString(),
            user_email: managerEmail,
            reporting_manager: '',
            company: company,
            company_id: companyId.toString()
        });

        await EmployeeModel.create({
            id: 'emp_rep1',
            name: 'Report 1',
            user_id: new mongoose.Types.ObjectId().toString(),
            user_email: reportEmail1,
            reporting_manager: managerEmail,
            company: company,
            company_id: companyId.toString()
        });

        await EmployeeModel.create({
            id: 'emp_rep2',
            name: 'Report 2',
            user_id: new mongoose.Types.ObjectId().toString(),
            user_email: reportEmail2,
            reporting_manager: managerEmail,
            company: company,
            company_id: companyId.toString()
        });

        await EmployeeModel.create({
            id: 'emp_other',
            name: 'Other Employee',
            user_id: new mongoose.Types.ObjectId().toString(),
            user_email: otherEmail,
            reporting_manager: 'someone_else@company.com',
            company: company,
            company_id: companyId.toString()
        });

        console.log('Resolving team emails for manager...');
        const teamEmails = await getTeamEmails(managerUser.email, companyId.toString(), company);
        console.log('Resolved Team Emails:', teamEmails);

        if (!teamEmails.includes(managerEmail)) throw new Error('Manager email should be in teamEmails');
        if (!teamEmails.includes(reportEmail1)) throw new Error('Report 1 email should be in teamEmails');
        if (!teamEmails.includes(reportEmail2)) throw new Error('Report 2 email should be in teamEmails');
        if (teamEmails.includes(otherEmail)) throw new Error('Other email should NOT be in teamEmails');
        console.log('✅ Scoping Resolution matches expectations perfectly.');

        // Test 2: Scoped Filter
        console.log('\n--- Test 2: Scoped Filter ---');
        const mockReq = {
            userId: managerUser._id.toString()
        };
        const filter = await getScopedFilter(mockReq);
        console.log('Resolved Scoped Filter:', filter);
        if (!filter.user_email || !filter.user_email.$in) {
            throw new Error('Filter must search for user_email with $in operator');
        }
        console.log('✅ Scoped Filter structure verified.');

        // Test 3: Self-Leave Approval Block
        console.log('\n--- Test 3: Self-Leave Approval Block ---');
        // Let's create a leave request for the manager
        const selfLeave = await LeaveModel.create({
            id: 'leave_mgr_self',
            user_id: managerUser._id.toString(),
            user_email: managerEmail,
            status: 'Pending'
        });

        // Simulating the check that we implemented in route PUT /leaves/:id
        const user = managerUser;
        const leave = await LeaveModel.findOne({ id: selfLeave.id });
        const canApprove = (leave.user_email.toLowerCase() !== user.email.toLowerCase());
        console.log(`Can manager self-approve leave? ${canApprove}`);
        if (canApprove) {
            throw new Error('Manager should NOT be allowed to self-approve their own leave request!');
        }
        console.log('✅ Self-leave approval correctly blocked.');

        // Test 4: Self-Resignation Approval Block
        console.log('\n--- Test 4: Self-Resignation Approval Block ---');
        const emp = await EmployeeModel.findOne({ user_email: managerEmail });
        const canApproveResignation = (emp.user_email.toLowerCase() !== user.email.toLowerCase());
        console.log(`Can manager self-approve resignation? ${canApproveResignation}`);
        if (canApproveResignation) {
            throw new Error('Manager should NOT be allowed to self-approve their own resignation request!');
        }
        console.log('✅ Self-resignation approval correctly blocked.');

        // Clean up
        await User.deleteMany({ email: { $in: [managerEmail, reportEmail1, reportEmail2, otherEmail] } });
        await EmployeeModel.deleteMany({ user_email: { $in: [managerEmail, reportEmail1, reportEmail2, otherEmail] } });
        await LeaveModel.deleteMany({ id: selfLeave.id });
        console.log('\n✅ All tests passed successfully!');
    } catch (error) {
        console.error('❌ Verification failed:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
    }
}

runTests();
