import express from "express";
import { registerUser } from "../controllers/register-user.js";
import { loginUser } from "../controllers/login-user.js";
import verifyLogin from "../controllers/verify-login.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify-login', verifyLogin);

export default router;
