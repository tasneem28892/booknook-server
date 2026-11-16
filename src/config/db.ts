import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing in .env file");
}

const client = new MongoClient(uri);

let database: Db;

export const connectDB = async () => {
  try {
    await client.connect();

    database = client.db("booknook");

    console.log("MongoDB Connected Successfully!");

    return database;
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!database) {
    throw new Error("Database is not connected yet!");
  }

  return database;
};