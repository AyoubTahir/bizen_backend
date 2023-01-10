import express from "express";
import * as productsController from "../controllers/productsController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken);
router
  .route("/")
  .get(productsController.all)
  .post(productsController.create)
  .patch(productsController.update)
  .delete(productsController.remove);

export default router;
