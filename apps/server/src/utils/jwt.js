import jwt from "jsonwebtoken";

const SECRET = process.env.APP_JWT_SECRET || "dev-secret";

export function signToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
    return jwt.verify(token, SECRET);
}
