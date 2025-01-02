import { Router } from "express";
import UserController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

const userController = new UserController();

router.post("/login", userController.login);
router.post("/scheduleMessage", authMiddleware, userController.scheduleMessage);
router.get("/getMessages", authMiddleware, userController.fetchMessageHistory);

export default router;
