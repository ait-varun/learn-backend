import { Router } from "express";
import db from "../db/connect.js";

const router = Router();

// Country routes
router.get("/", (req, res) => {
  db.query("SELECT * FROM countries", (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

export default router;
