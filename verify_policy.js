import mongoose from './server/db.js';
import { getModel } from './server/models/Generic.js';

async function run() {
    if (mongoose.connection.readyState !== 1) {
        await new Promise((resolve) => mongoose.connection.once('open', resolve));
    }
    
    console.log("=== Verification of New Governance & Policy Collections ===");
    
    const Policy = getModel('hr_policies');
    const policies = await Policy.find({});
    console.log(`Policies count: ${policies.length}`);
    if (policies.length > 0) {
        console.log("Sample policy name:", policies[0].name);
        console.log("Sample policy category:", policies[0].category);
    }
    
    const Ack = getModel('hr_policy_acknowledgements');
    const acks = await Ack.find({});
    console.log(`Acknowledgements count: ${acks.length}`);
    
    const Canteen = getModel('hr_canteen_registrations');
    const canteens = await Canteen.find({});
    console.log(`Canteen registrations count: ${canteens.length}`);
    
    const Audit = getModel('hr_audit_logs');
    const audits = await Audit.find({});
    console.log(`Audit logs count: ${audits.length}`);
    if (audits.length > 0) {
        console.log("Sample audit action:", audits[0].action_type);
        console.log("Sample audit details:", audits[0].details);
    }
    
    console.log("=== End Verification ===");
    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
