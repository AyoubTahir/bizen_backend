import express from "express";
import * as dashboardController from "../controllers/dashboardController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken);
router.route("/").get(dashboardController.counts);

export default router;
