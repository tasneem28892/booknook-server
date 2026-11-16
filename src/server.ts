import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import booksRoutes from "./routes/books.routes";
import borrowsRoutes from "./routes/borrows.routes";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("BookNook Server is Running!");
});

// Books API
app.use("/api/books", booksRoutes);

// Borrows API
app.use("/api/borrows", borrowsRoutes);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
  }
};

startServer();