import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/bezent';

async function main() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await mongoose.connection.collection('users').find({}).toArray();
    console.log('--- USERS ---');
    users.forEach(u => {
        console.log(`User: ${u.email}, Role: ${u.role}, hr_access: ${u.hr_access}`);
    });

    const employees = await mongoose.connection.collection('hr_employees').find({}).toArray();
    console.log('\n--- EMPLOYEES ---');
    employees.forEach(e => {
        console.log(`Employee: ${e.name} (${e.user_email}), Manager: ${e.reporting_manager}`);
    });

    const onduty = await mongoose.connection.collection('hr_onduty').find({}).toArray();
    console.log('\n--- ON DUTY REQUESTS ---');
    onduty.forEach(o => {
        console.log(`OD: ${o.id}, User: ${o.user_email}, Date: ${o.date}, Status: ${o.status}`);
    });

    const corrections = await mongoose.connection.collection('hr_corrections').find({}).toArray();
    console.log('\n--- CORRECTIONS ---');
    corrections.forEach(c => {
        console.log(`Correction: ${c.id}, User: ${c.user_email}, Category: ${c.category}, Date: ${c.date}, Status: ${c.status}, Type: ${c.type}`);
    });

    await mongoose.disconnect();
}

main().catch(console.error);
