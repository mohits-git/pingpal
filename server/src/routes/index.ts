import express from "express";
import { registerUser } from "../controllers/register-user.js";
import { loginUser } from "../controllers/login-user.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
