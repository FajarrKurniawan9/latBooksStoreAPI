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
router.get("/:id", getBookById);
router.post("/", postNewBooks);
router.put("/:id", putUpdateBooks);
router.delete("/:id", deleteBooks);

export default router;
