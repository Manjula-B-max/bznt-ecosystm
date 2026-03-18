import { getModel } from '../models/Generic.js';
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export const createCrudController = (table) => {
    const Model = getModel(table);

    return {
        getAll: async (req, res) => {
            try {
                const rows = await Model.find({ user_id: req.userId }).sort({ created_at: -1 }).lean();
                res.json(rows.map(doc => { delete doc._id; delete doc.__v; return doc; }));
            } catch(err) { res.status(500).json({error: err.message}); }
        },
        create: async (req, res) => {
            try {
                const data = req.body;
                data.id = data.id || uid();
                data.user_id = req.userId;
                
                await Model.findOneAndUpdate(
                    { id: data.id, user_id: req.userId },
                    { $set: data },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
                res.json({ id: data.id, ok: true });
            } catch(err) { res.status(500).json({error: err.message}); }
        },
        update: async (req, res) => {
            try {
                const data = req.body;
                delete data.id; delete data.user_id; delete data._id; 
                
                await Model.findOneAndUpdate(
                    { id: req.params.id, user_id: req.userId },
                    { $set: data }
                );
                res.json({ ok: true });
            } catch(err) { res.status(500).json({error: err.message}); }
        },
        remove: async (req, res) => {
            try {
                await Model.findOneAndDelete({ id: req.params.id, user_id: req.userId });
                res.json({ ok: true });
            } catch(err) { res.status(500).json({error: err.message}); }
        }
    };
};
