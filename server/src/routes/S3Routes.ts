import { Router } from "express";
import { DeleteImage, generateUploadUrl } from "../controllers/s3";

export const router =  Router();

router.post('/',generateUploadUrl);
router.delete('/',DeleteImage);