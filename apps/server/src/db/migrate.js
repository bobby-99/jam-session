import fs from "fs";
import path from "path";
import { pool } from "./pool.js";

const migrationsDir = new URL("../../migrations", import.meta.url);

async function run() {
    const files = fs.readdirSync(migrationsDir);

    for (const file of files) {
        const sql = fs.readFileSync(
            new URL(`../../migrations/${file}`, import.meta.url),
            "utf8"
        );

        console.log("Running migration:", file);
        await pool.query(sql);
    }

    console.log("Migrations complete");
    process.exit();
}

run().catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
});
