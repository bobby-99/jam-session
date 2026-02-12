import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { pool } from "./db/pool.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "API running" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/api/db-test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ dbTime: result.rows[0] });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Database connection failed" })
    }
});