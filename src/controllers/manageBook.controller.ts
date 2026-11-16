import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../config/db";

// Edit Book
export const updateBook = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const {
      title,
      author,
      category,
      image,
      description,
      totalCopies,
    } = req.body;

    if (
      !title ||
      !author ||
      !category ||
      !image ||
      !description ||
      totalCopies === undefined ||
      !Number.isInteger(Number(totalCopies)) ||
      Number(totalCopies) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid book information",
      });
    }

    const result = await getDB().collection("books").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          author,
          category,
          image,
          description,
          totalCopies: Number(totalCopies),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
    });
  } catch (error) {
    console.error("Error updating book:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update book",
    });
  }
};

// Delete Book
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const result = await getDB().collection("books").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting book:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete book",
    });
  }
};