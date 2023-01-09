import express from "express";
import { pathResolver } from "../config/path.js";

const router = express.Router();

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(pathResolver("/views", "index.html"));
});

export default router;
