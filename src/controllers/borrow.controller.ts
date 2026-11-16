import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../config/db";

// Borrow Book
export const borrowBook = async (req: Request, res: Response) => {
  try {
    const { bookId, userName, returnDate } = req.body;

    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (!bookId || !userName || !returnDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required information",
      });
    }

    if (!ObjectId.isValid(bookId) || isNaN(Date.parse(returnDate))) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID or return date",
      });
    }

    const db = getDB();

    const book = await db.collection("books").findOne({
      _id: new ObjectId(bookId),
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Check duplicate borrowing
    const existingBorrow = await db.collection("borrows").findOne({
      bookId: new ObjectId(bookId),
      userEmail,
    });

    if (existingBorrow) {
      return res.status(400).json({
        success: false,
        message: "You have already borrowed this book",
      });
    }

    // Decrease available copies
    const updateResult = await db.collection("books").updateOne(
      {
        _id: new ObjectId(bookId),
        totalCopies: { $gt: 0 },
      },
      {
        $inc: { totalCopies: -1 },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(400).json({
        success: false,
        message: "No copies available",
      });
    }

    const newBorrow = {
      bookId: new ObjectId(bookId),
      bookTitle: book.title,
      image: book.image,
      userName,
      userEmail,
      borrowDate: new Date(),
      returnDate: new Date(returnDate),
    };

    try {
      const result = await db.collection("borrows").insertOne(newBorrow);

      return res.status(201).json({
        success: true,
        message: "Book borrowed successfully",
        data: {
          _id: result.insertedId,
          ...newBorrow,
        },
      });
    } catch (error) {
      // Restore copy if saving fails
      await db.collection("books").updateOne(
        { _id: new ObjectId(bookId) },
        { $inc: { totalCopies: 1 } }
      );

      throw error;
    }
  } catch (error) {
    console.error("Error borrowing book:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to borrow book",
    });
  }
};

// Get All Borrows (Only Logged-in User)
export const getAllBorrows = async (req: Request, res: Response) => {
  try {
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const borrows = await getDB()
      .collection("borrows")
      .find({ userEmail })
      .sort({ borrowDate: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Borrow records fetched successfully",
      data: borrows,
    });
  } catch (error) {
    console.error("Error fetching borrows:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch borrows",
    });
  }
};

// Return Book (Only Owner Can Return)
export const returnBook = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid borrow ID",
      });
    }

    const db = getDB();

    // Find borrow record belonging to logged-in user
    const borrow = await db.collection("borrows").findOne({
      _id: new ObjectId(id),
      userEmail,
    });

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: "Borrow record not found",
      });
    }

    // Delete only this user's borrow record
    const deleteResult = await db.collection("borrows").deleteOne({
      _id: new ObjectId(id),
      userEmail,
    });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Borrow record not found",
      });
    }

    // Restore one available copy
    await db.collection("books").updateOne(
      { _id: borrow.bookId },
      { $inc: { totalCopies: 1 } }
    );

    return res.status(200).json({
      success: true,
      message: "Book returned successfully",
    });
  } catch (error) {
    console.error("Error returning book:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to return book",
    });
  }
};

// Get Borrowed Books by User
export const getUserBorrows = async (req: Request, res: Response) => {
  try {
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const borrows = await getDB()
      .collection("borrows")
      .find({ userEmail })
      .sort({ borrowDate: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      message: "User borrowed books fetched successfully",
      data: borrows,
    });
  } catch (error) {
    console.error("Error fetching user borrows:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch borrowed books",
    });
  }
};