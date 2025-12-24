import express, { Router } from "express";

import {
  getAllBooks,
  getBookById,
  postNewBooks,
  putUpdateBooks,
  deleteBooks,
} from "../controllers/books.controller.js";

import { authorize } from "../controllers/auth.controller.js";

const router = new Router();

router.get("/", authorize, getAllBooks);
router.get("/:id", authorize, getBookById);
router.post("/", authorize, postNewBooks);
router.put("/:id", authorize, putUpdateBooks);
router.delete("/:id", authorize, deleteBooks);

export default router;
