import { Request, Response } from "express";
import { getDB } from "../config/db";

export const addBook = async (req: Request, res: Response) => {
  try {
    const {
      title,
      author,
      category,
      image,
      description,
      userName,
      userEmail,
      totalCopies,
    } = req.body;

    // Check required fields
    if (
      !title ||
      !author ||
      !category ||
      !image ||
      !description ||
      !userName ||
      !userEmail ||
      totalCopies === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (!Number.isInteger(Number(totalCopies)) || Number(totalCopies) < 0) {
      return res.status(400).json({
        success: false,
        message: "Total copies must be a non-negative integer",
      });
    }

    const db = getDB();

    const newBook = {
      title,
      author,
      category,
      image,
      description,
      userName,
      userEmail,
      totalCopies: Number(totalCopies),
      createdAt: new Date(),
    };

    const result = await db.collection("books").insertOne(newBook);

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: {
        _id: result.insertedId,
        ...newBook,
      },
    });
  } catch (error) {
    console.error("Error adding book:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add book",
    });
  }
};