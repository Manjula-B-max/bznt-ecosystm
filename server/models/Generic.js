import mongoose from 'mongoose';

export const getModel = (table) => {
    if (mongoose.models[table]) return mongoose.models[table];
    const schema = new mongoose.Schema({
        id: { type: String, required: true, index: true },
        user_id: { type: String, required: true, index: true }
    }, { strict: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, collection: table });
    schema.set('toJSON', {
        transform: (doc, ret) => { delete ret._id; delete ret.__v; }
    });
    return mongoose.model(table, schema);
};
