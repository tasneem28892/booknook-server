import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../config/db";

// Get All Books
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const db = getDB();

    const books = await db
      .collection("books")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      data: books,
    });
  } catch (error) {
    console.error("Error fetching books:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch books",
    });
  }
};

// Get Single Book Details
export const getBookById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const book = await getDB()
      .collection("books")
      .findOne({ _id: new ObjectId(id) });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book details fetched successfully",
      data: book,
    });
  } catch (error) {
    console.error("Error fetching book:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch book details",
    });
  }
};