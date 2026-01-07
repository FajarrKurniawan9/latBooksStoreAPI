import express from "express";
import {
  getAllOrder,
  postCreateOrder,
  putUpdateOrder,
  deleteOrder,
} from "../controllers/transactions.controller.js";

import { authorize } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/", authorize, getAllOrder);
router.post("/", authorize, postCreateOrder);
router.put("/:id", authorize, putUpdateOrder);
router.delete("/:id", authorize, deleteOrder);

export default router;
