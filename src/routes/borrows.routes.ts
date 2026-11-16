import express from "express";

import {
  borrowBook,
  getAllBorrows,
  getUserBorrows,
  returnBook,
} from "../controllers/borrow.controller";

import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

// Protected routes
router.get("/", verifyToken, getAllBorrows);
router.get("/user", verifyToken, getUserBorrows);
router.post("/", verifyToken, borrowBook);
router.delete("/:id", verifyToken, returnBook);

export default router;