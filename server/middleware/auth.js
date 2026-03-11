import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'bezent_dev_secret_change_in_prod';

export function signToken(userId) {
    return jwt.sign({ sub: userId }, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
    return jwt.verify(token, SECRET);
}

/**
 * Express middleware — reads Bearer token from Authorization header,
 * verifies it, and attaches req.userId for downstream handlers.
 */
export function authMiddleware(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthenticated' });
    try {
        const payload = verifyToken(token);
        req.userId = payload.sub;
        next();
    } catch (_) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
