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

/*
Get session details by code
*/
router.get("/:code", async (req, res) => {
    try {
        const { code } = req.params;

        const { rows } = await pool.query(
            `SELECT s.id, s.code, s.active, h.display_name AS host
       FROM sessions s
       JOIN hosts h ON s.host_id = h.id
       WHERE s.code = $1`,
            [code]
        );

        if (!rows.length) {
            return res.status(404).json({ error: "Session not found" });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch session" });
    }
});

/*
Guest joins session
*/
router.post("/:code/join", async (req, res) => {
    try {
        const { code } = req.params;
        const { nickname } = req.body;

        const session = await pool.query(
            "SELECT id FROM sessions WHERE code = $1",
            [code]
        );

        if (!session.rows.length) {
            return res.status(404).json({ error: "Session not found" });
        }

        const guestId = nanoid();

        await pool.query(
            `INSERT INTO guests (id, session_id, nickname)
       VALUES ($1, $2, $3)`,
            [guestId, session.rows[0].id, nickname || "Guest"]
        );

        res.status(201).json({
            guestId,
            sessionId: session.rows[0].id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Join failed" });
    }
});



export default router;