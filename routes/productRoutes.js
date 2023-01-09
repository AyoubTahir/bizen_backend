import express from "express";
import * as productsController from "../controllers/productsController.js";

const router = express.Router();

router
  .route("/")
  .get(productsController.all)
  .post(productsController.create)
  .patch(productsController.update)
  .delete(productsController.remove);

export default router;
