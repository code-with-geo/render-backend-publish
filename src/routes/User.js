import express from "express";
import { signUp } from "../controllers/User.js";

const router = express.Router();

router.post("/signup", signUp);

export { router as UsersRouter };
