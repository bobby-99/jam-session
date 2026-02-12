import { verifyToken } from "../utils/jwt.js";

export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Missing token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        req.user = verifyToken(token);
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
}
