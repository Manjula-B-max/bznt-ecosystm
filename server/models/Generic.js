import mongoose from 'mongoose';

export const getModel = (table) => {
    if (mongoose.models[table]) return mongoose.models[table];
    
    let schemaFields = {
        id: { type: String, required: true, index: true },
        user_id: { type: String, required: true, index: true }
    };
    
    if (table === 'hr_loans') {
        schemaFields = {
            ...schemaFields,
            user_email: { type: String, required: true, lowercase: true, index: true },
            amount: { type: Number, required: true },
            repayment_months: { type: Number, required: true },
            monthly_emi: { type: Number, required: true },
            status: { type: String, default: 'Pending', index: true },
            remaining_balance: { type: Number, default: 0 }
        };
    }

    const schema = new mongoose.Schema(schemaFields, { strict: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, collection: table });
    schema.set('toJSON', {
        transform: (doc, ret) => { delete ret._id; delete ret.__v; }
    });
    return mongoose.model(table, schema);
};
