import express from "express";
import { nanoid } from "nanoid";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/*
Create new session
*/
router.post("/", requireAuth, async (req, res) => {
    try {
        const sessionId = nanoid();
        const code = nanoid(6);

        await pool.query(
            `INSERT INTO sessions (id, host_id, code)
       VALUES ($1, $2, $3)`,
            [sessionId, req.user.id, code]
        );

        res.status(201).json({
            sessionId,
            code,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Session creation failed" });
    }
});

export default router;