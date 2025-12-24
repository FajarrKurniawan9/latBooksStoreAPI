import express from "express";
import {
  getAllUsers,
  putUpdateUser,
  deleteUser,
} from "../controllers/users.controller.js";

import { authorize } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/", authorize, getAllUsers);
router.put("/:id", authorize, putUpdateUser);
router.delete("/:id", authorize, deleteUser);

export default router;
