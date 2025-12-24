import express from "express";
import {
  getAllUsers,
  putUpdateUser,
  deleteUser,
} from "../controllers/users.controller.js";

const router = express.Router();

router.get("/", getAllUsers);
router.put("/:id", putUpdateUser);
router.delete("/:id", deleteUser);

export default router;
