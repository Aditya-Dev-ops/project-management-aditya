import { Router } from "express";
import { checkOtp, getOtp, userLogin,  userSignUp } from "../controllers/AuthController";

const router = Router();

router.post('/login',userLogin);
router.post('/signup', userSignUp);
router.post('/login/forgot',getOtp);
router.post('/login/otp',checkOtp);



export default router;