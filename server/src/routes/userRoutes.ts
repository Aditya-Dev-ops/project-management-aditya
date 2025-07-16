import { Router } from "express";

import { getUser, getUsers, UpdateUser } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.post("/",UpdateUser);
router.get("/:email", getUser);
export default router;