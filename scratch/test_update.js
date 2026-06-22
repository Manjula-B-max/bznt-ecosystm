import mongoose from '../server/db.js';
import { getModel } from '../server/models/Generic.js';

async function main() {
    const Correction = getModel('hr_corrections');
    const doc = await Correction.findOne({ id: 'CORR-1SG477' });
    console.log('Before update:', doc);

    const res = await Correction.findOneAndUpdate(
        { id: 'CORR-1SG477' },
        { $set: { status: 'Cancelled' } },
        { new: true, strict: false }
    );
    console.log('Update result:', res);

    const docAfter = await Correction.findOne({ id: 'CORR-1SG477' });
    console.log('After update findOne:', docAfter);

    await mongoose.disconnect();
}

main().catch(console.error);
