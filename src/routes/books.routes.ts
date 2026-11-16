import express from "express";

import {
  getAllBooks,
  getBookById,
} from "../controllers/books.controller";

import { addBook } from "../controllers/addBook.controller";

import {
  updateBook,
  deleteBook,
} from "../controllers/manageBook.controller";

import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

// Public routes
router.get("/", getAllBooks);
router.get("/:id", getBookById);

// Protected routes
router.post("/", verifyToken, addBook);
router.patch("/:id", verifyToken, updateBook);
router.delete("/:id", verifyToken, deleteBook);

export default router;