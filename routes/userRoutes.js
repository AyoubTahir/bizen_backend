import express from "express";
import * as userController from "../controllers/usersController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken);
router
  .route("/")
  .get(userController.all)
  .post(userController.create)
  .patch(userController.update)
  .delete(userController.remove);

router.delete("/destroy", userController.destroy);

export default router;
