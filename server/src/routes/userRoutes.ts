import { Router } from "express";

import { getUser, getUsers } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
// router.post("/", postUser);
router.get("/:email", getUser);
export default router;